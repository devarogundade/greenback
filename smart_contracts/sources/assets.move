module greenback::assets {
    // ============== Imports ============== //

    use std::option;
    use std::signer;
    use std::string::{Self, String};
    use std::vector;
    use aptos_framework::event;
    use aptos_framework::object::{Self, Object};
    use aptos_framework::fungible_asset;
    use aptos_framework::primary_fungible_store;
    use aptos_token_objects::collection::{Self, Collection};
    use aptos_token_objects::token::{Self, Token};    
    use aptos_framework::fungible_asset::{FungibleStore};

    // ============== Errors ============== //

    const E_TOKEN_AMOUNT: u64 = 1;

    // ============== Events ============== //

    #[event]
    struct CreateFAEvent has store, drop {
        creator_addr: address,
        fa_obj_addr: address,
        max_supply: option::Option<u128>,
        name: String,
        symbol: String,
        decimals: u8,
        icon_uri: String,
        project_uri: String,
    }

    #[event]
    struct MintFAEvent has store, drop {
        fa_obj_addr: address,
        amount: u64,
        recipient_addr: address,
    }

    // ============== Structs ============== //

    struct FAController has key {
        mint_ref: fungible_asset::MintRef,
        burn_ref: fungible_asset::BurnRef,
        transfer_ref: fungible_asset::TransferRef,
        admin_store: Object<FungibleStore>
    }

    struct DAController has key {
        collection_name: String,
        mutator_ref: collection::MutatorRef
    }

    struct Registry has key {
        fungible_assets: vector<Object<fungible_asset::Metadata>>,
        digital_assets: vector<Object<Collection>>
    }

    // ============== Init Function ============== //

    fun init_module(sender: &signer) {
        let registry = Registry {
            fungible_assets: vector::empty(),
            digital_assets: vector::empty()
        };

        move_to(sender, registry);
    }

    // ============== Entry Functions ============== //

    public entry fun create_fungible_assets(
        sender: &signer,
    ) acquires Registry {
        // GCOIN
        create_fungible_asset_internal(
            sender, 
            option::some(1_000_000_000_000_000), // max supply
            string::utf8(b"Greenback Coin"), // name
            string::utf8(b"GCOIN"), // symbol
            8, // decimals
            string::utf8(b"https://thegreenback.xyz/images/gcoin.png"), // icon
            string::utf8(b"https://thegreenback.xyz") // project url
        );
    }

    public entry fun create_digital_assets(
        sender: &signer,
    ) acquires Registry {
        // GCOUPON
        create_digital_asset_internal(
            sender, 
            string::utf8(b"Greenback Coupon description."), // description
            string::utf8(b"Greenback Coupon"), // symbol
            string::utf8(b"https://thegreenback.xyz") // project url
        );

        // GNFT
        create_digital_asset_internal(
            sender, 
            string::utf8(b"Greenback non-fungible token description."), // description
            string::utf8(b"Greenback NFT"), // symbol
            string::utf8(b"https://thegreenback.xyz") // project url
        );
    }

    public entry fun mint_fungible_asset(
        sender: &signer,
        fa: Object<fungible_asset::Metadata>,
        amount: u64
    ) acquires FAController {
        let sender_addr = signer::address_of(sender);
        let fa_obj_addr = object::object_address(&fa);
        let config = borrow_global<FAController>(fa_obj_addr);
        primary_fungible_store::mint(&config.mint_ref, sender_addr, amount);
        event::emit(MintFAEvent {
            fa_obj_addr,
            amount,
            recipient_addr: sender_addr,
        });
    }

    public entry fun mint_digital_asset(
        admin: &signer,
        da: Object<Collection>,
        description: String,
        name: String,
        token_uri: String,
        user_address: address,
    ) acquires DAController {
        let admin_addr = signer::address_of(admin);
        let da_obj_addr = object::object_address(&da);
        let config = borrow_global_mut<DAController>(da_obj_addr);
        
        token::create_named_token(
            admin,
            config.collection_name,
            description,
            name,
            option::none(),
            token_uri
        );

        let token_addr = token::create_token_address(
            &admin_addr,
            &config.collection_name,
            &name
        );

        let token_obj = object::address_to_object<Token>(token_addr);

        object::transfer(admin, token_obj, user_address);
    }

    // ============== Friend Functions ============== //

    public fun transfer_fungible_asset(
        fa: Object<fungible_asset::Metadata>,
        user_address: address,
        amount: u64
    ) acquires FAController {
        let fa_obj_addr = object::object_address(&fa);
        let config = borrow_global<FAController>(fa_obj_addr);

        let user_store = primary_fungible_store::ensure_primary_store_exists(
            user_address,
            fa
        );

        fungible_asset::transfer_with_ref(
            &config.transfer_ref,
            config.admin_store,
            user_store,
            amount
        );
    }

    // ============== Internal Functions ============== //

    fun create_fungible_asset_internal(
        sender: &signer,
        max_supply: option::Option<u128>,
        name: String,
        symbol: String,
        decimals: u8,
        icon_uri: String,
        project_uri: String
    ) acquires Registry {
        let fa_obj_constructor_ref = &object::create_sticky_object(@greenback);
        let fa_obj_signer = object::generate_signer(fa_obj_constructor_ref);
        let fa_obj_addr = signer::address_of(&fa_obj_signer);

        primary_fungible_store::create_primary_store_enabled_fungible_asset(
            fa_obj_constructor_ref,
            max_supply,
            name,
            symbol,
            decimals,
            icon_uri,
            project_uri
        );

        let sender_address = signer::address_of(sender);
        let metadata_obj = object::address_to_object(fa_obj_addr);

        let mint_ref = fungible_asset::generate_mint_ref(fa_obj_constructor_ref);
        let burn_ref = fungible_asset::generate_burn_ref(fa_obj_constructor_ref);
        let transfer_ref = fungible_asset::generate_transfer_ref(fa_obj_constructor_ref);
        let admin_store = primary_fungible_store::ensure_primary_store_exists(
            sender_address, 
            metadata_obj
        );

        move_to(&fa_obj_signer, FAController {
            mint_ref,
            burn_ref,
            transfer_ref,
            admin_store
        });

        let registry = borrow_global_mut<Registry>(@greenback);
        vector::push_back(&mut registry.fungible_assets, metadata_obj);

        event::emit(CreateFAEvent {
            creator_addr: sender_address,
            fa_obj_addr,
            max_supply,
            name,
            symbol,
            decimals,
            icon_uri,
            project_uri,
        });
    }

    fun create_digital_asset_internal(
        sender: &signer,
        description: String,
        name: String,
        project_uri: String
    ) acquires Registry {
        let da_obj_constructor_ref = collection::create_unlimited_collection(
            sender,
            description,
            name,
            option::none(),
            project_uri
        );
        
        let da_obj_signer = object::generate_signer(&da_obj_constructor_ref);
        let da_obj_addr = signer::address_of(&da_obj_signer);

        let mutator_ref = collection::generate_mutator_ref(&da_obj_constructor_ref);

        move_to(&da_obj_signer, DAController {
            collection_name: name,
            mutator_ref
        });

        let registry = borrow_global_mut<Registry>(@greenback);
        vector::push_back(&mut registry.digital_assets, object::address_to_object(da_obj_addr));
    }

    // ============== View Functions =============== //

    #[view]
    public fun get_registry(): vector<Object<fungible_asset::Metadata>> acquires Registry {
        let registry = borrow_global<Registry>(@greenback);
        registry.fungible_assets
    }

    #[view]
    public fun get_metadata(
        fa: Object<fungible_asset::Metadata>
    ): (String, String, u8) {
        (
            fungible_asset::name(fa),
            fungible_asset::symbol(fa),
            fungible_asset::decimals(fa),
        )
    }

    #[view]
    public fun get_current_supply(fa: Object<fungible_asset::Metadata>): u128 {
        let maybe_supply = fungible_asset::supply(fa);
        if (option::is_some(&maybe_supply)) {
            option::extract(&mut maybe_supply)
        } else {
            0
        }
    }

    #[view]
    public fun get_max_supply(fa: Object<fungible_asset::Metadata>): u128 {
        let maybe_supply = fungible_asset::maximum(fa);
        if (option::is_some(&maybe_supply)) {
            option::extract(&mut maybe_supply)
        } else {
            0
        }
    }

    #[view]
    public fun get_balance(fa: Object<fungible_asset::Metadata>, user: address): u64 {
        primary_fungible_store::balance(user, fa)
    }
}