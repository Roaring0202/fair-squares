import { useAccountContext } from '../../contexts/Account_Context';
import React, { useEffect,useState } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import { arrangeText } from './Council';
import { InvestorData } from '@/src/contexts/types';
import {BN} from '@polkadot/util';
import { toUnit } from '../shared/utils';
import { Card } from 'antd';
import FundContribution from '../shared/contributionForm';

const data0:InvestorData={name:"",address:"",balance:"",fund_share:"",available_funds:"", reserved_funds:"", invested_funds:""}
const inv_image = "../../../INVESTOR.png"


export default function Investors(){
    const { api, blocks, selectedAccount, web3Name, credentials, dispatch } = useAppContext();
  const { role, balance,investor, dispatch0 } = useAccountContext();
//Get user infos
const[idata,setIdatas] = useState<InvestorData>();



useEffect(()=>{
    if (!api||!selectedAccount) return;
    dispatch0({ type: 'SET_INVESTOR', payload: data0 });
    let address0=selectedAccount.address;
    api.query.system.account(address0, ({ data: free }: { data: { free: BN } }) => {
        const free1 = toUnit(free.free.toString(),11)  
        dispatch0({ type: 'SET_BALANCE', payload: free1 });


      });
    api.query.rolesModule.investorLog(address0,(datalog:any)=>{
        let data0= datalog.toHuman();
        if(data0){
            let txt = data0.infos
            let infos = arrangeText(txt);       
            let datas0:InvestorData={...data0,name:infos[0],address:selectedAccount.address,balance:balance,fund_share:data0.share};
            dispatch0({ type: 'SET_INVESTOR', payload: datas0 });
          api.query.housingFundModule.contributions(address0,(data:any)=>{
            let data0 = data.toHuman();
            console.log(data0);
            if (data0){   
                let available_funds=toUnit(data0.availableBalance.toString().split(',').join(''),11);
                 let reserved_funds=toUnit(data0.reservedBalance.toString().split(',').join(''),11);
                let invested_funds=toUnit(data0.contributedBalance.toString().split(',').join(''),11);
                
                let datas:InvestorData={...datas0,available_funds,reserved_funds,invested_funds};
                setIdatas(datas)
                dispatch0({ type: 'SET_INVESTOR', payload: datas });
            }
        })
        }
    })
    

},[selectedAccount,blocks,api,dispatch0,balance])


const style1= { width: 450, height:400, background:`white`};

    return(
        <div>
            <div className=' flex flex-row'>
                <p>
                {
            investor?
            <Card
            className=' text-xl'
            cover={<img alt="example" style={{height:"30%", width:"30%"}} src={inv_image}/>}
            style={style1}
            >
                <p><b>Investor Name: </b>{investor.name.split(':')[1]}</p>
                <p><b>Wallet Balance:</b> {investor.balance}</p>
                <p><b>Available Balance in Fund: </b>{investor.available_funds}</p>
                <p><b>Share in Housing Fund:</b> {investor.fund_share}</p>
                <p><b>Reserved for Purchase:</b> {investor.reserved_funds}</p>
                <p><b>Amount Invested: </b>{investor.invested_funds}</p>
            </Card>:"NO DATA"}
                </p>

                <p className=' p-10'>
                    <FundContribution/>

                </p>
           
            </div>
           
            
        </div>
    )
}