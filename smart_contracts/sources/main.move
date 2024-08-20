module greenback::main {
    // ============== Imports ============== //

    use std::signer;
    use std::string::{Self, String};
    use std::option::{Self, Option};
    use aptos_std::table::{Self, Table};
    use aptos_framework::object::{Self, Object};
    use aptos_framework::fungible_asset::{Self, Metadata};

    use greenback::assets::{transfer_fungible_asset};
    
    friend greenback::dao;

    // ============== Errors ============== //

    const E_NOT_ENOUGH_BAL: u64 = 0;
    const E_NOT_ALLOWED: u64 = 1;
    const E_U64_OVERFLOW: u64 = 2;
    const E_DIVIDE_BY_ZERO: u64 = 3;
    const E_NOT_ACTIVE: u64 = 4;

    // ============== Constants ============== //

    const U64_MAX: u64 = 18446744073709551615;
    const DENOMINATOR: u64 = 1_000_000;

    // ============== Structs ============== //

    struct User has key {
        unclaimed_earnings: u64,
        withdrawn_earnings: u64,
        donated_earnings: u64,
        card_id: Option<String>
    }

    struct Registry has key {
        next_machine_id: u64,
        user_cards: Table<String, address>,
        machines: Table<u64, Machine>,
        admin_address: Option<address>,
        gcoin: Option<Object<Metadata>>,
        gcoupon: Option<Object<Metadata>>,
        gnft: Option<Object<Metadata>>,
        gcoin_to_aptos: u64
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
            user_cards: table::new(),
            machines: table::new(),
            admin_address: option::none(),
            gcoin: option::none(),
            gcoupon: option::none(),
            gnft: option::none(),
            gcoin_to_aptos: 25_000
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

        registry.gcoin = option::some(gcoin);
        registry.gcoupon = option::some(gcoupon);
        registry.gnft = option::some(gnft);
    }

    // ============== Entry Functions ============== //

    public entry fun create_user(
        sender: &signer
    ) {
        let user = User {
            unclaimed_earnings: 0,
            withdrawn_earnings: 0,
            donated_earnings: 0,
            card_id: option::none()
        };

        // Move user to the user account.
        move_to(sender, user);
    }

    public entry fun claim_earnings(
        sender: &signer,
        amount: u64
    ) acquires User, Registry {
        let registry = borrow_global<Registry>(@greenback);
        let gcoin = *option::borrow(&registry.gcoin);     

        let sender_address = signer::address_of(sender);
        let user = borrow_global_mut<User>(sender_address);

        user.unclaimed_earnings = user.unclaimed_earnings - amount;
        user.withdrawn_earnings = user.withdrawn_earnings + amount;

        let claimed_amount = mul_div_internal(amount, registry.gcoin_to_aptos, DENOMINATOR);

        let fa_obj_constructor_ref = &object::create_object(sender_address);
        let sender_store = fungible_asset::create_store(fa_obj_constructor_ref, gcoin);

        transfer_fungible_asset(sender_store, gcoin, claimed_amount);
    }

    public entry fun mint_coupon(
        sender: &signer,
        coupon_id: u64,
        amount: u64
    ) acquires User, Registry {
        let registry = borrow_global<Registry>(@greenback);
        let gcoin = *option::borrow(&registry.gcoin);     

        let sender_address = signer::address_of(sender);
        let user = borrow_global_mut<User>(sender_address);

        user.unclaimed_earnings = user.unclaimed_earnings - amount;
        user.withdrawn_earnings = user.withdrawn_earnings + amount;

        let claimed_amount = mul_div_internal(amount, registry.gcoin_to_aptos, DENOMINATOR);

        let fa_obj_constructor_ref = &object::create_object(sender_address);
        let sender_store = fungible_asset::create_store(fa_obj_constructor_ref, gcoin);

        transfer_fungible_asset(sender_store, gcoin, claimed_amount);
    }

    // ============== Friend Functions ============== //

    public fun get_voting_power(
        sender_address: address
    ): u64 acquires User {
        let user = borrow_global<User>(sender_address);
        user.donated_earnings
    }

    // ============== Entry(Admin) Functions ============== //

    public entry fun dispose_to_machine(
        admin: &signer,
        user_address: address,
        machine_id: u64,
        total_gram: u64
    ) acquires User, Registry {
        only_admin_internal(admin);

        dispose_to_machine_internal(
            admin,
            user_address,
            machine_id,
            total_gram
        );
    }

    public entry fun dispose_to_machine_via_card(
        admin: &signer,
        card_id: String,
        machine_id: u64,
        total_gram: u64
    ) acquires User, Registry {
        only_admin_internal(admin);

        let registry = borrow_global<Registry>(@greenback);
        let user_address = *table::borrow(&registry.user_cards, card_id);

        dispose_to_machine_internal(
            admin,
            user_address,
            machine_id,
            total_gram
        );
    }

    public entry fun mint_gnft_to_user(
        admin: &signer,
        user_object: Object<User>,
        amount: u64
    ) acquires Registry {
        only_admin_internal(admin);

        let registry = borrow_global_mut<Registry>(@greenback);
        let gnft = *option::borrow(&registry.gnft);     

        let user_address = object::object_address(&user_object);
        let fa_obj_constructor_ref = &object::create_object(user_address);
        let user_store = fungible_asset::create_store(fa_obj_constructor_ref, gnft);

        transfer_fungible_asset(user_store, gnft, amount);
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

    public entry fun update_user_card(
        admin: &signer,
        user_address: address,
        card_id: String
    ) acquires User, Registry {
        only_admin_internal(admin);

        let registry = borrow_global_mut<Registry>(@greenback);
        let user = borrow_global_mut<User>(user_address);

        table::add(&mut registry.user_cards, card_id, user_address);
        user.card_id = option::some(card_id);
    }

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

    // ============== Internal Functions ============== //

    fun dispose_to_machine_internal(
        admin: &signer,
        user_address: address,
        machine_id: u64,
        total_gram: u64
    ) acquires User, Registry {
        let registry = borrow_global_mut<Registry>(@greenback);
        let machine = *table::borrow_mut(&mut registry.machines, machine_id);

        assert!(machine.active, E_NOT_ACTIVE);

        let user = borrow_global_mut<User>(user_address);
        
        // Calculate the user reward amount
        let reward_amount = machine.reward_per_gram * total_gram;

        user.unclaimed_earnings = user.unclaimed_earnings + reward_amount;
        machine.dispensed_amount = machine.dispensed_amount + reward_amount;
    }

    fun only_admin_internal(
        admin: &signer,
    ) acquires Registry {
        let registry = borrow_global<Registry>(@greenback);
        let admin_address = *option::borrow(&registry.admin_address);

        assert!(admin_address == signer::address_of(admin), E_NOT_ALLOWED);
    }

    fun mul_div_internal(
        x: u64,
        y: u64,
        z: u64
    ): u64 {
        assert!(z != 0, E_DIVIDE_BY_ZERO);
        let r = (x as u128) * (y as u128) / (z as u128);
        assert!(!(r > (U64_MAX as u128)), E_U64_OVERFLOW);
        (r as u64)
    }

    // ============== View Functions ============== //
    
    #[view]
    public fun get_user(
        user_address: address
    ): (u64, u64, u64, Option<String>) acquires User {
        let user = borrow_global<User>(user_address);
        (
            user.unclaimed_earnings,
            user.withdrawn_earnings,
            user.donated_earnings,
            user.card_id
        )
    }

    #[view]
    public fun get_user_address(
        card_id: String
    ): address acquires Registry {
        let registry = borrow_global<Registry>(@greenback);
        *table::borrow(&registry.user_cards, card_id)
    }

    #[view]
    public fun gcoin_to_aptos(): u64 acquires Registry {
        let registry = borrow_global<Registry>(@greenback);
        registry.gcoin_to_aptos
    }

    #[view]
    public fun next_machine_id(): u64 acquires Registry {
        let registry = borrow_global<Registry>(@greenback);
        registry.next_machine_id
    }
}