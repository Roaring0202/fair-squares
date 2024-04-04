use crate::{mock::*, Error};
use frame_support::{assert_noop, assert_ok};
pub use super::*;

fn next_block() {
	System::set_block_number(System::block_number() + 1);
	Scheduler::on_initialize(System::block_number());
	//Democracy::on_initialize(System::block_number());
	//OnboardingModule::on_initialize(System::block_number());
	BiddingModule::begin_block(System::block_number());
	OnboardingModule::begin_block(System::block_number());
	

}

macro_rules! bvec {
	($( $x:tt )*) => {
		vec![$( $x )*].try_into().unwrap()
	}
}

fn fast_forward_to(n: u64) {
	while System::block_number() < n {
		next_block();
	}
}

#[test]
fn bidding_roles(){
	new_test_ext().execute_with(||{

		//let inv_list = vec![ALICE,DAVE,BOB,CHARLIE,EVE];
		//let rand_list = BiddingModule::choose_investor(inv_list);
		let metadata0: BoundedVec<u8, <Test as pallet_roles::Config>::MaxReasonLength>=
			b"I love cheese".to_vec().try_into().unwrap();
		assert_ok!(BiddingModule::do_something(RuntimeOrigin::signed(DAVE),0));
		println!("selected indexes: {:?}",BiddingModule::something());


		assert_eq!(RolesModule::get_pending_servicers().len(), 0);
		assert_eq!(RolesModule::get_pending_house_sellers().len(), 0);
		assert_eq!(RolesModule::get_pending_notaries().len(), 0);
		let council = Collective::members();
		assert_eq!(council.len(),3);

		//Investor & Tenant roles
		assert_ok!(RolesModule::set_role(RuntimeOrigin::signed(DAVE), DAVE, Acc::INVESTOR,metadata0.clone()));
		assert_ok!(RolesModule::set_role(RuntimeOrigin::signed(EVE), EVE, Acc::TENANT,metadata0.clone()));
		assert!(pallet_roles::InvestorLog::<Test>::contains_key(DAVE));
		assert!(pallet_roles::TenantLog::<Test>::contains_key(EVE));

		assert_ok!(RolesModule::set_role(RuntimeOrigin::signed(ALICE), ALICE, Acc::INVESTOR,metadata0.clone()));
		assert_ok!(RolesModule::set_role(RuntimeOrigin::signed(ACCOUNT_WITH_BALANCE0), ACCOUNT_WITH_BALANCE0, Acc::INVESTOR,metadata0.clone()));
		assert_ok!(RolesModule::set_role(RuntimeOrigin::signed(ACCOUNT_WITH_BALANCE1), ACCOUNT_WITH_BALANCE1, Acc::INVESTOR,metadata0.clone()));
		assert_ok!(RolesModule::set_role(RuntimeOrigin::signed(ACCOUNT_WITH_BALANCE2), ACCOUNT_WITH_BALANCE2, Acc::INVESTOR,metadata0.clone()));
		assert_ok!(RolesModule::set_role(RuntimeOrigin::signed(ACCOUNT_WITH_BALANCE3), ACCOUNT_WITH_BALANCE3, Acc::INVESTOR,metadata0.clone()));

		assert!(pallet_roles::InvestorLog::<Test>::contains_key(ALICE));
		assert!(pallet_roles::InvestorLog::<Test>::contains_key(ACCOUNT_WITH_BALANCE0));
		assert!(pallet_roles::InvestorLog::<Test>::contains_key(ACCOUNT_WITH_BALANCE1));
		assert!(pallet_roles::InvestorLog::<Test>::contains_key(ACCOUNT_WITH_BALANCE2));
		assert!(pallet_roles::InvestorLog::<Test>::contains_key(ACCOUNT_WITH_BALANCE3));

		//Seller,Servicer, and Notary roles
		assert_ok!(RolesModule::set_role(RuntimeOrigin::signed(BOB),BOB,Acc::SELLER,metadata0.clone()));
		assert_ok!(RolesModule::set_role(RuntimeOrigin::signed(EVE),EVE,Acc::SERVICER,metadata0.clone()));
		assert_ok!(RolesModule::set_role(RuntimeOrigin::signed(CHARLIE),CHARLIE,Acc::NOTARY,metadata0.clone()));

		assert_eq!(RolesModule::get_pending_house_sellers().len(),1);
		let account =RolesModule::get_pending_house_sellers()[0].account_id.clone();
		assert_eq!(account,BOB);
		assert_eq!(RolesModule::get_requested_role(BOB).unwrap().role.unwrap(),Acc::SELLER);

		assert_ok!(RolesModule::council_vote(RuntimeOrigin::signed(council[2].clone()),EVE,true));
		assert_ok!(RolesModule::council_vote(RuntimeOrigin::signed(council[1].clone()),EVE,true));
		assert_ok!(RolesModule::council_vote(RuntimeOrigin::signed(council[0].clone()),EVE,true));

		assert_ok!(RolesModule::council_vote(RuntimeOrigin::signed(council[2].clone()),BOB,true));
		assert_ok!(RolesModule::council_vote(RuntimeOrigin::signed(council[1].clone()),BOB,true));
		assert_ok!(RolesModule::council_vote(RuntimeOrigin::signed(council[0].clone()),BOB,true));

		assert_ok!(RolesModule::council_vote(RuntimeOrigin::signed(council[2].clone()),CHARLIE,true));
		assert_ok!(RolesModule::council_vote(RuntimeOrigin::signed(council[1].clone()),CHARLIE,true));
		assert_ok!(RolesModule::council_vote(RuntimeOrigin::signed(council[0].clone()),CHARLIE,true));

		assert_eq!(RolesModule::sellers(BOB).is_some(),false);

		assert_ok!(RolesModule::council_close(RuntimeOrigin::signed(council[2].clone()),BOB));
		assert_ok!(RolesModule::council_close(RuntimeOrigin::signed(council[2].clone()),EVE));
		assert_ok!(RolesModule::council_close(RuntimeOrigin::signed(council[2].clone()),CHARLIE));

		

		


		assert_eq!(RolesModule::get_pending_house_sellers().len(), 0);

		assert_eq!(RolesModule::sellers(BOB).is_some(),true);
		assert_eq!(RolesModule::notaries(CHARLIE).is_some(),true);
		assert_eq!(RolesModule::servicers(EVE).is_some(),true);


		assert_ok!(HousingFund::contribute_to_fund(RuntimeOrigin::signed(ALICE), 350_000*BSX));
		assert_ok!(HousingFund::contribute_to_fund(RuntimeOrigin::signed(DAVE), 160_000*BSX));
		assert_ok!(HousingFund::contribute_to_fund(RuntimeOrigin::signed(ACCOUNT_WITH_BALANCE0), 150_000*BSX));
		assert_ok!(HousingFund::contribute_to_fund(RuntimeOrigin::signed(ACCOUNT_WITH_BALANCE1), 70_000*BSX));
		assert_ok!(HousingFund::contribute_to_fund(RuntimeOrigin::signed(ACCOUNT_WITH_BALANCE2), 220_000*BSX));
		assert_ok!(HousingFund::contribute_to_fund(RuntimeOrigin::signed(ACCOUNT_WITH_BALANCE3), 530_000*BSX));

		assert_ok!(NftModule::create_collection(RuntimeOrigin::signed(EVE),pallet_nft::PossibleCollections::HOUSES,bvec![0,0,3]));

		
		assert_ok!(OnboardingModule::create_and_submit_proposal(RuntimeOrigin::signed(BOB),
																pallet_nft::PossibleCollections::HOUSES,
																 Some(2_605_000_000_000),
																 bvec![0u8; 20],
																   true,
																    3));
																	
	let council1 = Collective1::members();
	assert_eq!(council1.len(),3);

	assert_ok!(CouncilModule::seller_proposal_evaluation(
		RuntimeOrigin::signed(council1[0].clone()).into(), 
		pallet_nft::PossibleCollections::HOUSES, 
		0));


	let proposal = CouncilModule::get_submitted_proposal(BOB);
	assert_eq!(proposal.is_some(),true);

	let status = pallet_roles::AssetStatus::REVIEWING;
	let coll_id0 = pallet_nft::PossibleCollections::HOUSES;
	let coll_id = coll_id0.clone().value();
	assert_eq!(OnboardingModule::houses(coll_id,0).unwrap().status,status);

	assert_ok!(CouncilModule::housing_council_vote(RuntimeOrigin::signed(council1[0].clone()), BOB, true));
	assert_ok!(CouncilModule::housing_council_vote(RuntimeOrigin::signed(council1[1].clone()), BOB, true));
	assert_ok!(CouncilModule::housing_council_vote(RuntimeOrigin::signed(council1[2].clone()), BOB, true));	
	assert_ok!(CouncilModule::housing_council_close(RuntimeOrigin::signed(council1[1].clone()), BOB));

	let mut now = System::block_number();
	expect_events(vec![
		RuntimeEvent::CouncilModule(pallet_council::Event::HousingCouncilSessionClosed{ 
			who: council1[1].clone(), 
			proposal_index: 0, 
			when: now.clone()
		})
	]);
	//let end_block = now.saturating_add(<Test as pallet_council::Config>::CheckPeriod::get());
	//fast_forward_to(end_block);
	
	


		let  event_ref = 
		record(RuntimeEvent::CouncilModule(pallet_council::Event::ProposalApproved(System::block_number(), BOB)));
		assert_eq!(true,System::events().contains(&event_ref));



		
		now = System::block_number().saturating_mul(<Test as pallet_onboarding::Config>::CheckDelay::get());
		println!("Now is block nbr_{:?}",now);
		fast_forward_to(now);
		//next_block();
		
		//OnboardingModule::begin_block(now);
		let mut houses = OnboardingModule::houses(coll_id, 0).unwrap();
		assert_eq!(houses.status,pallet_roles::AssetStatus::VOTING);
		
		let  event_ref = 
		record(RuntimeEvent::OnboardingModule(pallet_onboarding::Event::ReferendumStarted { index: 0 }));
		assert_eq!(true,System::events().contains(&event_ref));

	
	
	assert_ok!(OnboardingModule::investor_vote(RuntimeOrigin::signed(ALICE), 0, true));
	assert_ok!(OnboardingModule::investor_vote(RuntimeOrigin::signed(DAVE), 0, true));
	assert_ok!(OnboardingModule::investor_vote(RuntimeOrigin::signed(ACCOUNT_WITH_BALANCE0), 0, true));
	assert_ok!(OnboardingModule::investor_vote(RuntimeOrigin::signed(ACCOUNT_WITH_BALANCE1), 0, true));
	assert_ok!(OnboardingModule::investor_vote(RuntimeOrigin::signed(ACCOUNT_WITH_BALANCE2), 0, true));
	assert_ok!(OnboardingModule::investor_vote(RuntimeOrigin::signed(ACCOUNT_WITH_BALANCE3), 0, true));

	assert_eq!(Democracy::referendum_count(), 1);

	fast_forward_to(5);
	
	assert_ok!(OnboardingModule::change_status(RuntimeOrigin::root(), coll_id0, 0, pallet_roles::AssetStatus::ONBOARDED));
	houses = OnboardingModule::houses(coll_id, 0).unwrap();

	assert_eq!(houses.status,pallet_roles::AssetStatus::ONBOARDED);
	
	let mut investors = vec![];
	 pallet_roles::InvestorLog::<Test>::iter().collect_into(&mut investors);
	//println!("The investors are:\n{:?}",investors);
	for i in investors{
		let fund_s = HousingFund::contributions(i.1.account_id).unwrap();
		println!("Contribution are:{:?}\n",fund_s.contributions);
	}

	

		next_block();
		let inv_round = BiddingModule::investors_list(coll_id, 0);
		println!("Selected investors are:\n{:?}",inv_round);

		loop{
			next_block();
			let val = System::block_number()  % <Test as crate::Config>::NewAssetScanPeriod::get() as u64;
			if val.is_zero(){
				break;
			}
		}
			for t in System::events(){
				println!("\n{:?}\n",t);
			}

	})

	
}
