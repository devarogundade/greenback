module greenback::greenback {
    // ============== Imports ============== //

    use std::option::{Self, Option};
    use std::signer;
    use std::string::{String};
    use aptos_framework::object::{Self, Object};
    use aptos_std::table::{Self, Table};
    use aptos_framework::fungible_asset::{Self, Metadata};

    friend greenback::donation_dao;
    use greenback::assets::{claim_fungible_asset};

    // ============== Errors ============== //

    const E_NOT_ENOUGH_BAL: u64 = 0;
    const E_NOT_ALLOWED: u64 = 1;

    // ============== Structs ============== //

    struct User has key {
        unclaimed_earnings: u64,
        withdrawn_earnings: u64,
        donated_earnings: u64
    }

    struct Registry has key {
        next_machine_id: u64,
        machines: Table<u64, Machine>,
        admin_address: Option<address>,
        gcoin: Option<Object<Metadata>>,
        gcoupon: Option<Object<Metadata>>,
        gnft: Option<Object<Metadata>>
    }

    struct Machine has copy, drop, store {
        reward_per_gram: u64,
        dispensed_amount: u64,
        location: String,
        active: bool
    }

    // ============== Init Function ============== //

    fun init_module(greenback: &signer) {
        let registry = Registry {
            next_machine_id: 0,
            machines: table::new(),
            admin_address: option::none(),
            gcoin: option::none(),
            gcoupon: option::none(),
            gnft: option::none()
        };

        move_to(greenback, registry);
    }

    public entry fun init_registry(
        admin: &signer,
        gcoin: Object<Metadata>,
        gcoupon: Object<Metadata>,
        gnft: Object<Metadata>,
    )  acquires Registry {
        let registry = borrow_global_mut<Registry>(@greenback);

        assert!(registry.admin_address == option::none(), E_NOT_ALLOWED);
        assert!(registry.gcoin == option::none(), E_NOT_ALLOWED);
        assert!(registry.gcoupon == option::none(), E_NOT_ALLOWED);
        assert!(registry.gnft == option::none(), E_NOT_ALLOWED);

        let admin_address = signer::address_of(admin);
        registry.admin_address = option::some(admin_address);

        registry.admin_address = option::some(gcoin);
        registry.admin_address = option::some(gcoupon);
        registry.admin_address = option::some(gnft);
    }

    // ============== Entry Functions ============== //

    public entry fun create_user(
        sender: &signer
    ) {
        let user = User {
            unclaimed_earnings: 0,
            withdrawn_earnings: 0,
            donated_earnings: 0
        };

        // Move user to the user account.
        move_to(sender, user);
    }

    public entry fun claim_earnings(
        sender: &signer,
        amount: u64
    ) acquires User, Registry {

    }

    // ============== Friend Functions ============== //

    public fun on_donate(
        sender: &signer,
        amount: u64
    ): address acquires User { 
        let sender_address = signer::address_of(sender);
        let user = borrow_global_mut<User>(sender_address);

        assert!(user.unclaimed_earnings >= amount, E_NOT_ENOUGH_BAL);
        
        // Update the user resource.
        user.unclaimed_earnings = user.unclaimed_earnings - amount;
        user.donated_earnings = user.donated_earnings + amount;

        sender_address
    }

    public fun get_voting_power(
        sender_address: address
    ): u64 acquires User {
        let user = borrow_global<User>(sender_address);
        user.donated_earnings
    }

    // ============== Entry(Admin) Functions ============== //

    public entry fun dispose_to_machine(
        admin: &signer,
        user_object: Object<User>,
        machine_id: u64,
        total_gram: u64
    ) acquires User, Registry {
        only_admin_internal(admin);

        let registry = borrow_global_mut<Registry>(@greenback);
        let machine = *table::borrow_mut(&mut registry.machines, machine_id);

        let user_address = object::object_address(&user_object);
        let user = borrow_global_mut<User>(user_address);
        
        // Calculate the user reward amount
        let reward_amount = machine.reward_per_gram * total_gram;

        user.unclaimed_earnings = user.unclaimed_earnings + reward_amount;
        machine.dispensed_amount = machine.dispensed_amount + reward_amount;
    }

    public entry fun mint_gnft_to_user(
        admin: &signer,
        user_object: Object<User>,
        amount: u64
    ) acquires User, Registry {
        only_admin_internal(admin);

        let registry = borrow_global_mut<Registry>(@greenback);
        let gnft = *option::borrow(&registry.gnft);     

        let user_address = object::object_address(&user_object);
        let fa_obj_constructor_ref = &object::create_object(user_address);
        let user_store = fungible_asset::create_store(fa_obj_constructor_ref, gnft);

        claim_fungible_asset(
            user_store,
            gnft,
            amount
        );
    }

    public entry fun create_machine(
        admin: &signer,
        reward_per_gram: u64,
        location: String
    ) acquires Registry {
        only_admin_internal(admin);

        let registry = borrow_global_mut<Registry>(@greenback);

        let machine = Machine {
            reward_per_gram, 
            dispensed_amount: 0,
            location,
            active: true
        };
        let machine_id = registry.next_machine_id + 1;

        table::add(&mut registry.machines, machine_id, machine);
        registry.next_machine_id = machine_id;
    }

    // ============== Internal Functions ============== //

    fun only_admin_internal(
        admin: &signer,
    ) acquires Registry {
        let registry = borrow_global<Registry>(@greenback);
        let admin_address = *option::borrow(&registry.admin_address);

        assert!(admin_address == signer::address_of(admin), E_NOT_ALLOWED);
    }

    // ============== View Functions ============== //
    
    #[view]
    fun get_user(
        user_address: address
    ): (u64, u64, u64) acquires User {
        let user = borrow_global<User>(user_address);
        (
            user_address.unclaimed_earnings,
            user_address.withdrawn_earnings,
            user_address.donated_earnings
        )
    }

    #[view]
    fun get_machines(): Table<u64, Machine> acquires Register {
        let regster = borrow_global<Register>(@greenback);
        regster.machines
    }

    #[view]
    fun next_machine_id(): u64 acquires Register {
        let regster = borrow_global<Register>(@greenback);
        regster.next_machine_id
    }
}