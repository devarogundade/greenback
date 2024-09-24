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
    use aptos_framework::account::{Self, SignerCapability};

    friend greenback::dao;
    friend greenback::main;

    // ============== Structs ============== //

    struct FAController has key {
        mint_ref: fungible_asset::MintRef,
        burn_ref: fungible_asset::BurnRef,
        transfer_ref: fungible_asset::TransferRef
    }

    struct DAController has key {
        collection_name: String,
        mutator_ref: collection::MutatorRef
    }

    struct Registry has key {
        signer_cap: SignerCapability
    }

    // ============== Init Function ============== //

    fun init_module(greenback: &signer) {
        let (res_signer, res_signer_cap) = account::create_resource_account(greenback, b"Registry");

        let registry = Registry {
            signer_cap: res_signer_cap
        };

        move_to(greenback, registry);

        // GCOIN
        create_fungible_asset_internal(
            &res_signer, 
            option::none(), // max supply
            string::utf8(b"Greenback Coin"), // name
            string::utf8(b"GCOIN"), // symbol
            8, // decimals
            string::utf8(b"https://thegreenback.xyz/images/gcoin.png"), // icon
            string::utf8(b"https://thegreenback.xyz") // project url
        );

        // GCOUPON
        create_digital_asset_internal(
            &res_signer,
            string::utf8(b"Greenback Coupon description."), // description
            string::utf8(b"Greenback Coupon"), // symbol
            string::utf8(b"https://thegreenback.xyz") // project url
        );

        // GNFT
        create_digital_asset_internal(
            &res_signer,
            string::utf8(b"Greenback non-fungible token description."), // description
            string::utf8(b"Greenback NFT"), // symbol
            string::utf8(b"https://thegreenback.xyz") // project url
        );
    }


    // ============== Friend Functions ============== //

    public(friend) fun deposit_coin(
        sender: &signer,
        fa: Object<fungible_asset::Metadata>,
        amount: u64
    ) acquires FAController, Registry {
        let registry = borrow_global<Registry>(@greenback);
        let res_signer = account::create_signer_with_capability(&registry.signer_cap);

        let fa_obj_addr = object::object_address(&fa);
        let config = borrow_global<FAController>(fa_obj_addr);

        let sender_address = signer::address_of(sender);

        let sender_store = primary_fungible_store::ensure_primary_store_exists(
            sender_address,
            fa
        );

        let greenback_store = primary_fungible_store::ensure_primary_store_exists(
            signer::address_of(&res_signer),
            fa
        );

        fungible_asset::transfer(
            sender,
            sender_store,
            greenback_store,
            amount
        );
    }

    public(friend) fun transfer_coin(
        fa: Object<fungible_asset::Metadata>,
        receiver: address,
        amount: u64
    ) acquires FAController, Registry {
        let registry = borrow_global<Registry>(@greenback);
        let res_signer = account::create_signer_with_capability(&registry.signer_cap);

        let fa_obj_addr = object::object_address(&fa);
        let config = borrow_global<FAController>(fa_obj_addr);

        let receiver_store = primary_fungible_store::ensure_primary_store_exists(
            receiver,
            fa
        );

        let greenback_store = primary_fungible_store::ensure_primary_store_exists(
            signer::address_of(&res_signer),
            fa
        );

        fungible_asset::transfer_with_ref(
            &config.transfer_ref,
            greenback_store,
            receiver_store,
            amount
        );
    }

    public(friend) fun mint_fungible_asset(
        fa: Object<fungible_asset::Metadata>,
        to: address,
        amount: u64
    ) acquires FAController {
        let fa_obj_addr = object::object_address(&fa);
        let config = borrow_global<FAController>(fa_obj_addr);
        primary_fungible_store::mint(&config.mint_ref, to, amount);
    }

    public(friend) fun mint_digital_asset(
        da: Object<Collection>,
        description: String,
        name: String,
        token_uri: String,
        to: address,
    ) acquires DAController, Registry {
        let registry = borrow_global<Registry>(@greenback);
        let res_signer = account::create_signer_with_capability(&registry.signer_cap);

        let da_obj_addr = object::object_address(&da);
        let config = borrow_global_mut<DAController>(da_obj_addr);
        
        token::create_named_token(
            &res_signer,
            config.collection_name,
            description,
            name,
            option::none(),
            token_uri
        );

        let token_addr = token::create_token_address(
            &signer::address_of(&res_signer),
            &config.collection_name,
            &name
        );

        let token_obj = object::address_to_object<Token>(token_addr);

        object::transfer(&res_signer, token_obj, to);
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
    ): Object<fungible_asset::Metadata> {
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

        primary_fungible_store::mint(&mint_ref, sender_address, 1_000_000_000_000_000);
        
        move_to(&fa_obj_signer, FAController {
            mint_ref,
            burn_ref,
            transfer_ref
        });

        metadata_obj
    }

    fun create_digital_asset_internal(
        sender: &signer,
        description: String,
        name: String,
        project_uri: String
    ) {
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
    }
}