#![cfg_attr(not(feature = "std"), no_std)]
pub use frame_support::{
    dispatch::DispatchResult,
    pallet_prelude::*,
    inherent::Vec,
    sp_runtime::traits::{Hash, Zero},
    storage::child,
    traits::{Currency, Get, ReservableCurrency},
    PalletId		
 };
pub use frame_system::{pallet_prelude::*,ensure_signed};
pub use frame_support::pallet_prelude::*;
pub use scale_info::{prelude::vec,TypeInfo};

pub struct House<T,U,V,W,X>{
    pub houseowner:T,
    pub valuation:U,
    pub rent:U,
    pub balance:U,
    pub class_id:V,
    pub token_id:W,
    pub funded:X,    
}


#[derive(Clone, Encode, Decode, Default, PartialEq, Eq, TypeInfo)]
#[cfg_attr(feature = "std", derive(Debug))]
pub struct Contribution<T,U>{
    pub account:T,
    pub amount:U,
}

impl<T,U>Contribution<T,U>{
    pub fn new(acc:T,val:U)-> Self{
        Self{
            account:acc,
            amount:val,
        }
    }
}