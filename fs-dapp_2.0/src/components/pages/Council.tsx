import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import { useAccountContext } from '../../contexts/Account_Context';
import { useEffect,MouseEvent,useState } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import { useConcilSessionContext } from '../../contexts/CouncilSessionContext';
import { DataType, Proposal } from '@/src/contexts/types';
import { web3FromAddress } from '@polkadot/extension-dapp';
import { Toast } from 'flowbite-react';
import { NotificationTwoTone, WarningTwoTone } from '@ant-design/icons';
import {BN,formatBalance} from '@polkadot/util';

import { toUnit } from '../shared/utils';
import RolesApp from '../shared/modal';
import Referendum from '../shared/referendum';
import { Card, Col, Space } from 'antd';
import Identicon from '@polkadot/react-identicon';
import InfiniteScroll from "react-infinite-scroll-component";
import { Avatar,  Divider, List, Skeleton } from "antd";
import { Button  } from 'antd';

export function arrangeText(val:string){
  let alltxt=val.split(":");
  let output00=`FullName: ${alltxt[0]};E-MAIL: ${alltxt[2]};WebSite: ${alltxt[3]};Motivation: ${alltxt[4]};Additional Notes: ${alltxt[5]}
  `
  let output0= output00.split(";")
  return output0
}

export default function Council() {
  const { api, blocks, selectedAccount,accounts,  dispatch } = useAppContext();
  const { role, balance, dispatch0 } = useAccountContext();
  const { session_closed,approved,role_in_session,nay,ayes,council_members,selectedProposal,proposals, datas,dispatch1 } = useConcilSessionContext();
  const [out,setOut]= useState<string[]>();
  const [voted,setVoted]= useState(false);
  const [event, setEvents] = useState('No Vote');
  const [showToast, setShowToast] = useState(false);
  const [warning, setWarning] = useState(false);
  const [treshold,setTres] = useState(0);
  const [close,setClose] = useState(true);
  const initprop:Proposal={voter_id:undefined,Referendum_account:undefined,session_closed:false,approved:false,ayes:0,nay:0,hash:"",infos:""}
    
  const getproposal= (item:MouseEvent)=>{
    
    let txt=item.currentTarget.textContent
    
    proposals.forEach((prop)=>{
      let acc1=prop.Referendum_account
      if (!acc1) return;
      let name= acc1.address
      if (!name||!txt) return;
      if(txt.includes(name.slice(0,6)+'...'+name.slice(-6,-1))){
        dispatch1({type:`SET_SELECTED_PROPOSAL`,payload:prop});
      }
      console.log(prop.infos)

    });
    if(selectedProposal){
      //console.log(selectedProposal.infos);
      //console.log(council_members);
    }   
  }
  const handleClose=async()=>{
    if (!api||!selectedAccount||!selectedProposal) return;
    let who = selectedAccount.address;
    let prop = selectedProposal.Referendum_account?.address
    if(!prop) return;
    const tx = await api.tx.rolesModule.councilClose(prop)
    const injector = await web3FromAddress(who);
    tx.signAndSend(who,{signer:injector.signer});
    setClose(true)
  }
  const handleClick= async (vote:boolean)=>{
    
    if (!api||!selectedAccount||!selectedProposal) return;
    let who = selectedAccount.address;
    let prop = selectedProposal.Referendum_account?.address
    if(!prop) return;
    const tx = await api.tx.rolesModule.councilVote(prop,vote);
    const fees = await tx.paymentInfo(who);
      const injector = await web3FromAddress(who);
      tx.signAndSend(who, { signer: injector.signer }, ({ status, events, dispatchError }) => {
        if (dispatchError && status.isInBlock) {
          if (dispatchError.isModule) {
            console.log(`Current status: ${status.type}`);
            // for module errors, we have the section indexed, lookup
            const decoded = api.registry.findMetaError(dispatchError.asModule);
            const { docs, name, section } = decoded;
            setEvents(name.toString());
            setShowToast(true);
            setWarning(true);

          //  console.log(`${section}.${name}: ${docs.join(' ')}`);
          }
        } else if (status.isInBlock) {
         // console.log(`Fees: ${fees.partialFee}`);
         // console.log(`Current status: ${status.type}`);
          events.forEach(({ event: { method, section, data } }) => {
            if (section.toString().includes('rolesModule')) {
              let meth = method.toString() + '\n';
              formatBalance.setDefaults({ decimals: 12, unit: 'FS' });
              let payed = formatBalance(new BN(fees.partialFee.toString()),{ withSi: true, withZero: false });
              setEvents(`${meth} =>Paid fees: ${payed} `);
              setShowToast(true);
              setWarning(false);
            }
          });
        } else {
         // console.log(`Current status: ${status.type}`);
        }
      });
      setVoted(true)
  }

  function checkVote(){
    if (!api||!selectedAccount) return;
    api.query.backgroundCouncil.voting.entries((all:any[])=>{
      all.forEach(([key,value])=>{
        let inf=value.toHuman();
        let yes:string[] = inf.ayes;
        let no:string[] = inf.nays;
        
        if (yes.includes(selectedAccount.address)||no.includes(selectedAccount.address)){
          let tres = yes.length+no.length
        setTres(tres);
          console.log(`it works:${treshold}`)
          setVoted(true)
        }else{
          setVoted(false);
          setTres(0)
        }
        
      })
    })
  }
  /*function arrangeText(val:string){
    if(!val) return([""]);
    let alltxt=val.split(":");
    let output00=`FullName: ${alltxt[0]};E-MAIL: ${alltxt[2]};WebSite: ${alltxt[3]};Motivation: ${alltxt[4]};Additional Notes: ${alltxt[5]}
    `
    let output0= output00.split(";")
    return output0
  }*/

   function getDatas(){
    if (!api||!selectedAccount) return;
    let tdata:DataType[]=[];
    let props:Proposal[]=[];
    
    api.query.rolesModule.requestedRoles.entries((all:any[])=>{     
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
    let val = ""
    if (!selectedProposal){val=""}else{val=selectedProposal.infos}
    let txt = arrangeText(val);
    setOut(txt)   
    checkVote()
    
    console.log(`available datas: ${datas}`)
    if (datas.toString()===""){
      dispatch1({type:`SET_SELECTED_PROPOSAL`,payload:initprop});
      setVoted(false)
    }

    if(treshold<2){setClose(true)}else{setClose(false)};  
    //console.log(`Datas length after:${datas.length}`)
  }, [blocks,api,selectedAccount,treshold,dispatch1]);

 
const style1= { width: 310, height:250, background:`white`};
const style2= { width: 310, height:250, background:`#ffccc7`};
const style3= { width: 310, height:250, background:`#f4ffb8`};
const style4= { width: 410, height:400, background:`white`};
if(!selectedAccount||!council_members.includes(selectedAccount)){
  return(
    <div className=' flex font-bold text-5xl justify-center py-12'>
    You Are not a Council Member
  </div>
  )
}

  return(
  <div className="flex flex-row justify-between p-6">

<div id="scrollableDiv"
  style={{
    height: 600,
    overflow: 'auto',
    padding: '0 16px',
   // border: '1px solid rgba(140, 140, 140, 0.35)',
  }}>
    
       <List
          dataSource={datas}          
          renderItem={item => (
            <Card 
            onClick={getproposal}
            hoverable
            cover={<img alt="example" style={{height:"30%", width:"30%"}} src={item.infos.split(`:`)[1]}/>}
      style={(item.status==="AWAITING" && item.referendum==="false")?style1:
             ((item.status==="AWAITING" && item.referendum==="true")?style2:style3)}>
            <List.Item key={item.address}>
              <List.Item.Meta
                title={<p>{item.address.slice(0,6)+'...'+item.address.slice(-6,-1)}</p>}
                description={<div><p>Requested Role: {item.role}</p><p>Request Status: {item.status}</p><p>Session is closed: {item.referendum}</p></div>}
              />
            </List.Item>
            </Card>
          )}

        /> 

          
  </div>
  <div >
  <p className=' flex gap-3'>
          <Button onClick={()=>{handleClick(true);
            
          }} disabled={voted || selectedProposal?.infos===""} type="primary" className="bg-blue-600 text-white font-bold py-2 pb-10  text-xl">AYES</Button>
          <Button onClick={()=>{handleClick(false);
          }} disabled={voted || selectedProposal?.infos===""} type="primary" className="bg-red-600 text-white font-bold py-2 pb-10   text-xl">NAY</Button>
          <Button onClick={()=>{handleClose();}} disabled={close} type="primary" className="bg-green-800 text-white font-bold py-2 pb-10   text-xl">CLOSE</Button>
            
          <Card title={"User Information"} style={style4}>
    {out?out.map((x)=>(
      <div ><p className=' font-semibold'>{x.split(":")[0]}:</p> {x.split(":")[1]}</div>
    )):""}
    <p className=' font-semibold'>Voted:</p>
    {voted?"You voted!":"Not Yet!"}
  </Card>
  </p> 
  <p>
  {!(showToast === false) ? (
        <Toast>
          <div
            className={
              'shadow-md rounded-md flex  text-white text-base items-center justify-normal ' +
              (warning === true ? ' bg-red-500 animate-bounce ' : ' bg-green-600  animate-pulse')
            }
          >
            <div>
              {!(warning === true) ? (
                <NotificationTwoTone twoToneColor="#52c41a" className="h-8 w-8" />
              ) : (
                <WarningTwoTone twoToneColor="#eb2f96" className="h-8 w-8" />
              )}
            </div>
            <div className="p-2">{event}</div>
            <Toast.Toggle
              onClick={() => {
                setShowToast(false);
              }}
            />
          </div>
        </Toast>
      ) : (
        <div className=" p-2"> </div>
      )}
  </p>
  </div>
  </div>
  
  );

  }