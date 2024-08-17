module greenback::assets {
    // ============== Imports ============== //

    use std::option;
    use std::signer;
    use std::string;
    use std::vector;
    use aptos_framework::event;
    use aptos_framework::object;
    use aptos_framework::fungible_asset;
    use aptos_framework::primary_fungible_store;

    // ============== Events ============== //

    #[event]
    struct CreateFAEvent has store, drop {
        creator_addr: address,
        fa_obj_addr: address,
        max_supply: option::Option<u128>,
        name: string::String,
        symbol: string::String,
        decimals: u8,
        icon_uri: string::String,
        project_uri: string::String,
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
        transfer_ref: fungible_asset::TransferRef
    }

    struct Registry has key {
        assets: vector<object::Object<fungible_asset::Metadata>>
    }

    // ============== Init Function ============== //

    fun init_module(sender: &signer) {
        let registry = Registry {
            assets: vector::empty()
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
            string::utf8(b"https://aptos-thegreenback.xyz/images/gcoin.png"), // icon
            string::utf8(b"https://aptos-thegreenback.xyz") // project url
        );

        // GCOUPON
        create_fungible_asset_internal(
            sender, 
            option::none(), // max supply
            string::utf8(b"Greenback Coupon"), // name
            string::utf8(b"GCOUPON"), // symbol
            0, // decimals
            string::utf8(b"https://aptos-thegreenback.xyz/images/gcoupon.png"), // icon
            string::utf8(b"https://aptos-thegreenback.xyz") // project url
        );

        // GNFT
        create_fungible_asset_internal(
            sender, 
            option::none(), // max supply
            string::utf8(b"Greenback NFT"), // name
            string::utf8(b"GNFT"), // symbol
            0, // decimals
            string::utf8(b"https://aptos-thegreenback.xyz/images/gnft.png"), // icon
            string::utf8(b"https://aptos-thegreenback.xyz") // project url
        );
    }

    public entry fun mint_fungible_asset(
        sender: &signer,
        fa: object::Object<fungible_asset::Metadata>,
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

    // ============== Friend Functions ============== //

    public fun claim_fungible_asset(
        store: object::Object<fungible_asset::FungibleStore>,
        fa: object::Object<fungible_asset::Metadata>,
        amount: u64
    ) acquires FAController {
        let fa_obj_addr = object::object_address(&fa);
        let config = borrow_global<FAController>(fa_obj_addr);

        fungible_asset::deposit(
            store,
            fungible_asset::withdraw_with_ref(&config.transfer_ref, fa, amount)
        );
    }

    // ============== Internal Functions ============== //

    fun create_fungible_asset_internal(
        sender: &signer,
        max_supply: option::Option<u128>,
        name: string::String,
        symbol: string::String,
        decimals: u8,
        icon_uri: string::String,
        project_uri: string::String
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

        let mint_ref = fungible_asset::generate_mint_ref(fa_obj_constructor_ref);
        let burn_ref = fungible_asset::generate_burn_ref(fa_obj_constructor_ref);
        let transfer_ref = fungible_asset::generate_transfer_ref(fa_obj_constructor_ref);

        move_to(&fa_obj_signer, FAController {
            mint_ref,
            burn_ref,
            transfer_ref,
        });

        let registry = borrow_global_mut<Registry>(@greenback);
        vector::push_back(&mut registry.assets, object::address_to_object(fa_obj_addr));

        event::emit(CreateFAEvent {
            creator_addr: signer::address_of(sender),
            fa_obj_addr,
            max_supply,
            name,
            symbol,
            decimals,
            icon_uri,
            project_uri,
        });
    }

    // ============== View Functions =============== //

    #[view]
    public fun get_registry(): vector<object::Object<fungible_asset::Metadata>> acquires Registry {
        let registry = borrow_global<Registry>(@greenback);
        registry.assets
    }

    #[view]
    public fun get_metadata(
        fa: object::Object<fungible_asset::Metadata>
    ): (string::String, string::String, u8) {
        (
            fungible_asset::name(fa),
            fungible_asset::symbol(fa),
            fungible_asset::decimals(fa),
        )
    }

    #[view]
    public fun get_current_supply(fa: object::Object<fungible_asset::Metadata>): u128 {
        let maybe_supply = fungible_asset::supply(fa);
        if (option::is_some(&maybe_supply)) {
            option::extract(&mut maybe_supply)
        } else {
            0
        }
    }

    #[view]
    public fun get_max_supply(fa: object::Object<fungible_asset::Metadata>): u128 {
        let maybe_supply = fungible_asset::maximum(fa);
        if (option::is_some(&maybe_supply)) {
            option::extract(&mut maybe_supply)
        } else {
            0
        }
    }

    #[view]
    public fun get_balance(fa: object::Object<fungible_asset::Metadata>, user: address): u64 {
        primary_fungible_store::balance(user, fa)
    }
}