module greenback::events {
    // ============== Imports ============== //

    use std::signer;
    use std::string::String;
    use aptos_framework::event;

    friend greenback::dao;

    // ============== Structs ============== //

    #[event]
    struct CreateDAO has drop, store {
        dao_address: address,
        name: String,
        dao_resolve_threshold: u64,
        voting_duration: u64,
        min_proposal_weight: u64,
        admin_address: address,
    }

    #[event]
    struct CreateProposal has drop, store {
        dao_address: address,
        proposer: address,
        proposal_id: u64,
        title: String,
        description: String,
        image: String,
        proposed_amount: u64,
        start_time_sec: u64
    }

    #[event]
    struct DonateToDAO has drop, store {
        dao_address: address,
        sender_address: address,
        amount: u64
    }

    #[event]
    struct Vote has drop, store {
        dao_address: address,
        voter_address: address,
        proposal_id: u64,
        vote: bool
    }

    #[event]
    struct Resolve has drop, store {
        dao_address: address,
        proposal_id: u64,
        result: u8,
    }

    #[event]
    struct AdminResolve has drop, store {
        dao_address: address,
        proposal_id: u64,
        admin_address: address,
        reason: String,
    }

    // ============== Friend Functions ============== //

    public(friend) fun emit_create_dao_event(
        dao_address: address,
        name: String,
        dao_resolve_threshold: u64,
        voting_duration: u64,
        min_proposal_weight: u64,
        admin_address: address,
    ) {
        event::emit(CreateDAO {
            dao_address,
            name,
            dao_resolve_threshold,
            voting_duration,
            min_proposal_weight,
            admin_address,
        });
    }

    public(friend) fun emit_create_proposal_event(
        proposer: address,
        dao_address: address,
        proposal_id: u64,
        title: String,
        description: String,
        image: String,
        proposed_amount: u64,
        start_time_sec: u64
    ) {
        event::emit(CreateProposal {
            dao_address,
            proposer,
            proposal_id,
            title,
            description,
            image,
            proposed_amount,
            start_time_sec
        });
    }

    public(friend) fun emit_donate_to_dao_event(
        dao_address: address,
        sender_address: address,
        amount: u64
    ) {
        event::emit(DonateToDAO {
            dao_address,
            sender_address,
            amount
        });
    }
 
    public(friend) fun emit_voting_event(
        voter_address: address,
        dao_address: address,
        proposal_id: u64,
        vote: bool
    ) {
        event::emit(Vote {
            dao_address,
            voter_address,
            proposal_id,
            vote
        });
    }

    public(friend) fun emit_resolve_event(proposal_id: u64, dao_address: address, result: u8) {
        event::emit(Resolve {
            dao_address,
            proposal_id,
            result,
        });
    }

    public(friend) fun emit_admin_resolve_event(
        proposal_id: u64,
        admin_address: address,
        dao_address: address,
        reason: String
    ) {
        event::emit(AdminResolve {
            dao_address,
            proposal_id,
            admin_address,
            reason,
        });
    }
}