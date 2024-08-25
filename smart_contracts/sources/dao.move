module greenback::dao {
    // ============== Imports ============== //

    use std::option::{Self, Option};
    use std::signer;
    use std::string::{Self, String};
    use std::vector;
    use aptos_framework::account;
    use aptos_framework::fungible_asset::{Self, Metadata};
    use aptos_framework::object::{Self, Object};
    use aptos_std::table::{Self, Table};
    use aptos_framework::account::{SignerCapability};
    use std::error;
    use std::bcs;
    use aptos_framework::timestamp;

    use greenback::main::{get_voting_power, on_donate};
    use greenback::assets::{transfer_fungible_asset};
    use greenback::events;

    // ============== Errors ============== //

    const E_PR0POSALS_NOT_EXIST_AT_ADDRESS: u64 = 0;
    const E_PR0POSALS_ID_NOT_EXIST: u64 = 1;
    const E_STRING_TOO_LONG: u64 = 2;
    const E_VOTING_POWER_NOT_ENOUGH: u64 = 3;
    const E_PROPOSAL_START_TIME_SHOULD_BE_IN_FUTURE: u64 = 4;
    const E_DAO_NOT_EXIST: u64 = 5;
    const E_PROPOSAL_NOT_FOUND: u64 = 6;
    const E_PROPOSAL_ENDED: u64 = 7;
    const E_PROPOSAL_NOT_STARTED: u64 = 8;
    const E_PROPOSAL_NOT_END: u64 = 12;
    const E_ALREADY_VOTED: u64 = 9;
    const E_PROPOSAL_RESOLVED: u64 = 11;
    const E_INVALID_ADMIN_ACCOUNT: u64 = 10;
    const E_VOTING_STATISTICS_NOT_FOUND: u64 = 13;
    const E_LOW_FUNDS: u64 = 14;

    // ============== Constants ============== //

    const PROPOSAL_PENDING: u8 = 0;
    const PROPOSAL_RESOLVED_PASSED: u8 = 1;
    const PROPOSAL_RESOLVED_NOT_PASSED: u8 = 2;
    const PROPOSAL_RESOLVED_BY_ADMIN: u8 = 3;
    const PROPOSAL_VETOED_BY_ADMIN: u8 = 4;

    // ============== Structs ============== //

    struct DAO has key {
        name: String,
        available_amount: u64,
        raised_amount: u64,
        resolve_threshold: u64,
        voting_duration: u64,
        min_required_proposer_voting_power: u64,
        next_proposal_id: u64,
        dao_signer_capability: SignerCapability,
        gcoin: Object<Metadata>,
        proposals: Table<u64, Proposal>,
        admin: address
    }

    struct Proposal has copy, drop, store {
        title: String,
        description: String,
        image: String,
        proposed_amount: u64,
        start_time_sec: u64,
        resolution: u8,
        final_yes_votes: u64,
        final_no_votes: u64,
    }

    struct ProposalVotingStatistics has key {
        proposals: Table<u64, VotingStatistics>,
    }

    struct VotingStatistics has store {
        total_yes: u64,
        total_no: u64,
        yes_votes: Table<address, u64>, 
        no_votes: Table<address, u64>,
    }

    // ============== Entry Functions ============== //

    public entry fun create_dao(
        admin: &signer,
        name: String,
        threshold: u64,
        voting_duration: u64,
        min_required_proposer_voting_power: u64,
        gcoin: Object<Metadata>,
    ) {
        // create a resource account
        let seed = bcs::to_bytes(&name);

        let (res_signer, res_cap) = account::create_resource_account(admin, seed);
        let admin_address = signer::address_of(admin);

        move_to(
            &res_signer,
            DAO {
                name,
                available_amount: 0,
                raised_amount: 0,
                resolve_threshold: threshold,
                voting_duration,
                min_required_proposer_voting_power,
                next_proposal_id: 0,
                dao_signer_capability: res_cap,
                gcoin,
                proposals: table::new(),
                admin: admin_address
            },
        );

        move_to(
            &res_signer,
            ProposalVotingStatistics {
                proposals: table::new()
            }
        );

        let dao_address = signer::address_of(&res_signer);

        events::emit_create_dao_event(
            dao_address,
            name,
            threshold,
            voting_duration,
            min_required_proposer_voting_power,
            admin_address,
        );
    }

    public entry fun create_proposal(
        sender: &signer,
        dao_address: address,
        title: String,
        description: String,
        image: String,
        proposed_amount: u64,
        start_time_sec: u64,
    ) acquires DAO {
        let dao = borrow_global_mut<DAO>(dao_address);

        assert!(string::length(&title) <= 64, error::invalid_argument(E_STRING_TOO_LONG));
        assert!(string::length(&description) <= 512, error::invalid_argument(E_STRING_TOO_LONG));

        let sender_address = signer::address_of(sender);

        if (sender_address != dao.admin) {
            let voting_power = get_voting_power(sender_address);
            assert!(
                voting_power >= dao.min_required_proposer_voting_power,
                error::permission_denied(E_VOTING_POWER_NOT_ENOUGH)
            );
        };

        // verify the start_time is in future
        let now = timestamp::now_seconds();
        assert!(start_time_sec > now, error::invalid_argument(E_PROPOSAL_START_TIME_SHOULD_BE_IN_FUTURE));

        let proposal = Proposal {
            title,
            description,
            image,
            proposed_amount,
            start_time_sec,
            resolution: PROPOSAL_PENDING,
            final_yes_votes: 0,
            final_no_votes: 0,
        };

        let proposal_id = dao.next_proposal_id + 1;

        table::add(&mut dao.proposals, proposal_id, proposal);
        dao.next_proposal_id = proposal_id;

        events::emit_create_proposal_event(
            sender_address,
            dao_address,
            proposal_id,
            title,
            description,
            image,
            proposed_amount,
            start_time_sec
        );
    }

    public entry fun vote(
        sender: &signer,
        dao_address: address,
        proposal_id: u64,
        vote: bool
    ) acquires DAO, ProposalVotingStatistics {
        assert!(exists<DAO>(dao_address), error::not_found(E_DAO_NOT_EXIST));

        let dao = borrow_global_mut<DAO>(dao_address);

        // assert the proposal hasn't ended, voter can can only vote for the proposal that starts and hasn't ended
        assert!(table::contains(&dao.proposals, proposal_id), error::not_found(E_PROPOSAL_NOT_FOUND));
        let proposal = table::borrow(&dao.proposals, proposal_id);
        let now = timestamp::now_seconds();
        assert!(now < proposal.start_time_sec + dao.voting_duration, error::invalid_argument(E_PROPOSAL_ENDED));
        assert!(now > proposal.start_time_sec, error::invalid_argument(E_PROPOSAL_NOT_STARTED));

        let prop_stats = borrow_global_mut<ProposalVotingStatistics>(dao_address);

        // initialize the voting statistics of the proposal
        if (!table::contains(&prop_stats.proposals, proposal_id)) {
            let vstat = VotingStatistics {
                total_yes: 0,
                total_no: 0,
                yes_votes: table::new(),
                no_votes: table::new(),
            };
            table::add(&mut prop_stats.proposals, proposal_id, vstat);
        };
        let stats = table::borrow_mut(&mut prop_stats.proposals, proposal_id);

        let voter_address = signer::address_of(sender);

        // check if this token already voted
        assert!(!table::contains(&stats.no_votes, voter_address), error::invalid_argument(E_ALREADY_VOTED));
        assert!(!table::contains(&stats.yes_votes, voter_address), error::invalid_argument(E_ALREADY_VOTED));

        let voting_power = get_voting_power(voter_address);

        if (vote) {
            stats.total_yes = stats.total_yes + 1;
            table::add(&mut stats.yes_votes, voter_address, voting_power);
        } else {
            stats.total_no = stats.total_no + 1;
            table::add(&mut stats.no_votes, voter_address, voting_power);
        };

        events::emit_voting_event(
            voter_address,
            dao_address,
            proposal_id,
            vote
        );
    }

    public entry fun resolve(
        proposal_id: u64, 
        dao_address: address
    ) acquires DAO, ProposalVotingStatistics {
        assert!(exists<DAO>(dao_address), error::not_found(E_DAO_NOT_EXIST));
        let dao = borrow_global<DAO>(dao_address);

        // assert the proposal voting ended
        assert!(table::contains(&dao.proposals, proposal_id), error::not_found(E_PROPOSAL_NOT_FOUND));
        let proposal = table::borrow(&dao.proposals, proposal_id);
        let now = timestamp::now_seconds();
        assert!(now >= proposal.start_time_sec + dao.voting_duration, error::invalid_argument(E_PROPOSAL_NOT_END));
      
        // assert the proposal is unresolved yet
        assert!(proposal.resolution == PROPOSAL_PENDING, error::invalid_argument(E_PROPOSAL_RESOLVED));
        resolve_internal(option::none(), proposal_id, dao_address);
    }
    
    public entry fun donate(
        sender: &signer,
        dao_address: address,
        amount: u64
    ) acquires DAO {
        let sender_address = on_donate(sender, amount);

        let dao = borrow_global_mut<DAO>(dao_address);

        dao.raised_amount = dao.raised_amount + amount;
        dao.available_amount = dao.available_amount + amount;

        // Emit event
        events::emit_donate_to_dao_event(
            dao_address,
            sender_address,
            amount
        );
    }

    public entry fun admin_resolve(
        admin: &signer, 
        proposal_id: u64, 
        dao_address: address, 
        reason: String
    ) acquires DAO, ProposalVotingStatistics {
        let resolver = signer::address_of(admin);

        let dao = borrow_global<DAO>(dao_address);

        // assert the proposal voting ended
        assert!(table::contains(&dao.proposals, proposal_id), error::not_found(E_PROPOSAL_NOT_FOUND));
        let proposal = table::borrow(&dao.proposals, proposal_id);

        // assert the proposal is unresolved yet
        assert!(proposal.resolution == PROPOSAL_PENDING, error::invalid_argument(E_PROPOSAL_RESOLVED));
        resolve_internal(option::some(resolver), proposal_id, dao_address);

        events::emit_admin_resolve_event(
            proposal_id,
            signer::address_of(admin),
            dao_address,
            reason,
        )
    }

    // ============== Internal Functions ============== //
    
    fun resolve_internal(
        resolver: Option<address>,
        proposal_id: u64, dao_address: address
    ) acquires DAO, ProposalVotingStatistics {
        let dao = borrow_global_mut<DAO>(dao_address);

        // assert the proposal voting ended
        let proposal = table::borrow_mut(&mut dao.proposals, proposal_id);

        if (option::is_some(&resolver)) {
            // only DAO admin can execute the proposal directly
            assert!(*option::borrow(&resolver) == dao.admin, error::permission_denied(E_INVALID_ADMIN_ACCOUNT));
          
            execute_proposal(proposal, dao);
            proposal.resolution = PROPOSAL_RESOLVED_BY_ADMIN;

            return
        };

        assert!(exists<ProposalVotingStatistics>(dao_address), error::not_found(E_VOTING_STATISTICS_NOT_FOUND));
      
        let proposal_stat = &mut borrow_global_mut<ProposalVotingStatistics>(dao_address).proposals;
        let voting_stat = table::borrow_mut(proposal_stat, proposal_id);
        proposal.final_yes_votes = voting_stat.total_yes;
        proposal.final_no_votes = voting_stat.total_no;

        // validate resolve threshold and result
        let voted = voting_stat.total_no + voting_stat.total_yes;

        if (voted < dao.resolve_threshold) {
            // not sufficient voting power
            proposal.resolution = PROPOSAL_RESOLVED_NOT_PASSED;
        } 
        else if(voting_stat.total_yes > voting_stat.total_no) {
            execute_proposal(proposal, dao);
            proposal.resolution = PROPOSAL_RESOLVED_PASSED;
        } 
        else {
            proposal.resolution = PROPOSAL_RESOLVED_NOT_PASSED;
        };

        events::emit_resolve_event(
            proposal_id,
            dao_address,
            proposal.resolution,
        )
    }

    inline fun execute_proposal(
        proposal: &mut Proposal, 
        dao: &mut DAO
    ) {
        assert!(dao.available_amount > proposal.proposed_amount, E_LOW_FUNDS);

        transfer_fungible_asset(
            dao.gcoin,
            dao.admin,
            proposal.proposed_amount
        );

        dao.available_amount = dao.available_amount - proposal.proposed_amount;
    }

    // ============== View Functions ============== //

    #[view]
    public fun get_proposal(proposal_id: u64, dao_address: address): Proposal acquires DAO {
        let proposals = &borrow_global<DAO>(dao_address).proposals;
        assert!(table::contains(proposals, proposal_id), error::not_found(E_PR0POSALS_ID_NOT_EXIST));
        *table::borrow(proposals, proposal_id)
    }

    #[view]
    public fun get_proposal_resolution(proposal_id: u64, dao_address: address): u8 acquires DAO {
        let proposal = get_proposal(proposal_id, dao_address);
        proposal.resolution
    }

    #[view]
    public fun unpack_dao(dao_address: address): (String, u64, u64, u64, u64, u64, u64, address) acquires DAO {
        let dao = borrow_global<DAO>(dao_address);
        (
            dao.name,
            dao.available_amount,
            dao.raised_amount,
            dao.resolve_threshold,
            dao.voting_duration,
            dao.min_required_proposer_voting_power,
            dao.next_proposal_id,
            dao.admin
        )
    }

    #[view]
    public fun unpack_proposal(proposal_id: u64, dao_address: address): (String, String, String, u64, u64, u8, u64, u64) acquires DAO {
        let proposal = get_proposal(proposal_id, dao_address);
        (
            proposal.title,
            proposal.description,
            proposal.image,
            proposal.proposed_amount,
            proposal.start_time_sec,
            proposal.resolution,
            proposal.final_yes_votes,
            proposal.final_no_votes
        )
    }
} 