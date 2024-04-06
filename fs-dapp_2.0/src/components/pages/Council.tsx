import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import { useAccountContext } from '../../contexts/Account_Context';
import React, { useEffect,MouseEvent,useState,useCallback } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import { useConcilSessionContext } from '../../contexts/CouncilSessionContext';
import { DataType, Proposal } from '@/src/contexts/types';
import BN from 'bn.js';
import { toUnit } from '../shared/utils';
import RolesApp from '../shared/modal';
import Referendum from '../shared/referendum';
import { Card, Col, Space } from 'antd';
import Identicon from '@polkadot/react-identicon';
import InfiniteScroll from "react-infinite-scroll-component";
import { Avatar,  Divider, List, Skeleton } from "antd";
import { Button } from 'flowbite-react';


export default function Council() {
  const { api, blocks, selectedAccount,accounts,  dispatch } = useAppContext();
  const { role, balance, dispatch0 } = useAccountContext();
  const { session_closed,approved,role_in_session,nay,ayes,council_members,selectedProposal,proposals, datas,dispatch1 } = useConcilSessionContext();
  
    
  const getproposal= (item:MouseEvent)=>{
    
    let txt=item.currentTarget.textContent
    
    proposals.forEach((prop)=>{
      let acc1=prop.Referendum_account
      if (!acc1) return;
      let name= acc1.address
      if (!name||!txt) return;
      if(txt.includes(name)){
        dispatch1({type:`SET_SELECTED_PROPOSAL`,payload:prop});
      }
      

    });
    if(selectedProposal){
      console.log(selectedAccount);
      console.log(council_members);
    }   
  }
  

   function getDatas(){
    let tdata:DataType[]=[];
    let props:Proposal[]=[];
    
    api?.query.rolesModule.requestedRoles.entries((all:any[])=>{
      if (!selectedAccount) return;      
     // if (!council_members.includes(selectedAccount)) return;
       all.forEach(([key, value]) => {
        let Prop = value.toHuman();
        if(!Prop) return;
        let acc0 = Prop.accountId;
        let acc1 = accounts.find((account) => account.address === acc0);
        if(!acc1) return;
        
        //console.log(`names are:${acc1.meta.name}`)
        let r_session = Prop.role.toString();
      let status = Prop.approved.toString();
      let referendum = Prop.sessionClosed.toString();
      let hash = Prop.proposalHash.toString();
      let infos = Prop.infos.toString();      
      console.log(Prop.infos.split(`:`)[1])

      api.query.backgroundCouncil.voting(hash,(data:any)=>{
        let data1 = data.toHuman();
          if (data1 !== null) {
            let yes = data1.ayes.length;
            let no = data1.nays.length;
            dispatch1({ type: 'SET_AYES', payload: yes });
            dispatch1({ type: 'SET_NAY', payload: no });
          }
      })
      
      let dtype:DataType={name:acc1.meta.name,role:r_session,address: Prop.accountId,status,referendum,hash,infos};      
      let prop0:Proposal={voter_id:selectedAccount,Referendum_account:acc1,session_closed:referendum,approved:status,ayes,nay,hash,infos}
      props.push(prop0);
      tdata.push(dtype);      
              }
);

dispatch1({type:`SET_DATAS`,payload:tdata});
dispatch1({type:`SET_PROPOSALS`,payload:props});
    });
    
  }

  
  
   useEffect(() => {
    if (!api || !selectedAccount) return;
    api.query.backgroundCouncil.members((who: any[]) => {
      
      let members:InjectedAccountWithMeta[]=[];
      
      who.forEach((x)=>{
        let y=x.toHuman();
        accounts.forEach((ac)=>{
          if(ac.address===y){
            members.push(ac)
          }
        })
      })
      //console.log(members)
      
      dispatch1({ type: 'SET_COUNCIL_MEMBERS', payload: members });
    });
    
    getDatas();    
    
    //console.log(`Datas length after:${datas.length}`)
  }, [selectedAccount,blocks]);

 
const style1= { width: 410, height:400, background:`white`};
const style2= { width: 410, height:400, background:`red`};
const style3= { width: 410, height:400, background:`green`};
  return((selectedAccount && council_members.includes(selectedAccount))?
  
  <div id="scrollableDiv"
  style={{
    height: 600,
    overflow: 'auto',
    padding: '0 16px',
    border: '1px solid rgba(140, 140, 140, 0.35)',
  }}>
    
       <List
          dataSource={datas}
          
          renderItem={item => (
            <Card 
            onClick={getproposal}
            hoverable
            cover={<img alt="example" style={{height:"50%", width:"50%"}} src={item.infos.split(`:`)[1]}/>}
      style={(item.status==="AWAITING" && item.referendum==="false")?style1:
             ((item.status==="AWAITING" && item.referendum==="true")?style2:style3)}>
            <List.Item key={item.address}>
              <List.Item.Meta
                title={<p>{item.address}</p>}
                description={<div><p>Requested Role: {item.role}</p><p>Request Status: {item.status}</p><p>Session is closed: {item.referendum}</p></div>}
              />
            </List.Item>
            </Card>
          )}

        />

   
    
  </div>:<div>
    You Are not a Council Member
  </div>);

  }