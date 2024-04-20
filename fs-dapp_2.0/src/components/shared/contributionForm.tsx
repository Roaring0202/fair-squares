import {useForm,FieldError} from 'react-hook-form';
import { useAccountContext } from '../../contexts/Account_Context';
import { useAppContext } from '../../contexts/AppContext';
import { toUnit } from './utils';
import { useState,useEffect } from 'react';
import {Checkbox } from 'antd';
import { Button } from 'flowbite-react';
import type { CheckboxProps } from 'antd';
import { NotificationTwoTone, WarningTwoTone } from '@ant-design/icons';
import { web3FromAddress } from '@polkadot/extension-dapp';
import { Toast } from 'flowbite-react';

type Contribution = {
    amount: string;
}



export default function FundContribution(){

    const {register,handleSubmit,formState:{errors}}= useForm<Contribution>();
    const { api, selectedAccount} = useAppContext();
    const [minc,setMinc]=useState(0);
    const [contmin,setContmin]=useState(false);
    const [event, setEvents] = useState('No Vote');
    const [showToast, setShowToast] = useState(false);
    const [warning, setWarning] = useState(false);
  

    
    const onChange: CheckboxProps['onChange'] = (e) => {
        console.log(`checked = ${e.target.checked}`);
        setContmin(!contmin);
        if (contmin===true){

        }
      };
    
    function getEditorStyle(fieldError: FieldError|undefined){
        return fieldError?'border-red-500':``;
    }

    const onSubmit= async(contribution:Contribution)=>{
        if (!api||!selectedAccount) return;
        let f_amount=0;
        if(contmin===true){
            f_amount=minc
        }else{
            f_amount= Number(contribution.amount)*1E11;
        }
        let who = selectedAccount.address;
        const tx = await api.tx.housingFundModule.contributeToFund(f_amount);
        const fees = await tx.paymentInfo(who);
        const injector = await web3FromAddress(who);
        tx.signAndSend(who, { signer: injector.signer }, ({ status, events, dispatchError }) => {
            if (dispatchError && status.isInBlock) {
              if (dispatchError.isModule) {
                console.log(`Current status: ${status.type}`);
                // for module errors, we have the section indexed, lookup
                const decoded = api.registry.findMetaError(dispatchError.asModule);
                const {name} = decoded;
                setEvents(name.toString());
                setShowToast(true);
                setWarning(true);
              }
            } else if (status.isInBlock) {
              events.forEach(({ event: { method, section, data } }) => {
                if (section.toString().includes('housingFundModule')) {
                  let meth = method.toString() + '\n';
                  
                  let payed = toUnit(fees.partialFee.toString(),11)
                  setEvents(`${meth} =>Paid fees: ${payed} `);
                  setShowToast(true);
                  setWarning(false);
                }
              });
            } else {
            }
          });

    }

    function getMin(){
        if (!api||!selectedAccount) return;
        let res = Number(api.consts.housingFundModule.minContribution)
        setMinc(res)
        //formatBalance.setDefaults({ decimals: 11, unit: 'USD' });
        //let min = formatBalance(new BN(res),{ withSi: true, withZero: false })
    }

    useEffect(()=>{
        getMin();

    },)


    const fieldstyle = "flex flex-col mb-2"

    return(
        <div className="flex flex-col py-10 max-w-md mx-auto">
            <h2 className="font-bold text-xl underline mb-3">Contribute To the Housing Fund</h2>
      <Checkbox onChange={onChange} className=' text-xl font-bold'>Minimum ({toUnit(minc.toString(),11)})</Checkbox>
        <p>
        <form noValidate onSubmit={handleSubmit(onSubmit)}>
            <div className={fieldstyle}>
                <label htmlFor='amount'>Customised Contribution (In USD)</label>
                <input style={!contmin?{backgroundColor: '#DAF7A6'}:{backgroundColor:'grey'}} defaultValue="5000" disabled={contmin} type='number' id='amount' className={getEditorStyle(errors.amount)}{...register('amount',{
                    min:{
                        value:5000,
                        message:'Amount below minimun'
                    }
                    })}/>
            </div>
            <div>
                <Button
                type="submit"
                className="bg-blue-600 text-white font-bold   text-xl"> CONTRIBUTE </Button>
            </div>
        </form>
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
    )
}