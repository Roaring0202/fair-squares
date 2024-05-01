import {useForm,FieldError} from 'react-hook-form';
import { useAccountContext } from '../../contexts/Account_Context';
import { ASSETS } from "../../contexts/types";
import { Button } from 'flowbite-react';

type Details = {
    picture: string;
    asset_type: string;
    asset_name: string;
    asset_price:number;
    tenants_capacity:number;
    description: string;
    contact_email: string;
    website: string;
    notes: string;
}



export function DetailsPage(){
    const {register,handleSubmit,formState:{errors}}= useForm<Details>();
    const { dispatch0 } = useAccountContext();

    
    
    function onSubmit(details:Details){
        let pic="";
        if (!details.picture||details.picture===""){
            pic=`../../../johndoe.png`
           
        }else{pic=details.picture}
        let all_infos:string = 
        `${pic}:${details.asset_type}        
        :${details.asset_name}
        :${details.asset_price}
        :${details.tenants_capacity}
        :${details.description}
        :${details.contact_email}
        :${details.website}
        :${details.notes}`;
        
        dispatch0({type:`SET_INFOS`,payload:all_infos});

    }

    function getEditorStyle(fieldError: FieldError|undefined){
        return fieldError?'border-red-500':``;
    }

    const fieldstyle = "flex flex-col mb-2"
    return(
        <div>
            <form noValidate onSubmit={handleSubmit(onSubmit)}>
                <div className={fieldstyle}>
                    <label htmlFor='picture'>Asset Picture</label>

                    <select 
                    id="picture" 
                    {...register('picture')}>
                    <option value= "../../../HOUSES.png">HOUSES</option>
                    <option value= "../../../OFFICES.png">OFFICES</option>
                    <option value= "../../../APPARTMENTS.png">APPARTMENTS</option>
                    </select>
                </div>

                <div className={fieldstyle}>
                    <label htmlFor='type'>Asset Type</label>

                    <select 
                    id="type" 
                    {...register('asset_type')}>
                    <option value= {ASSETS[0]}>HOUSES</option>
                    <option value= {ASSETS[1]}>OFFICES</option>
                    <option value= {ASSETS[2]}>APPARTMENTS</option>
                    </select>
                </div>

                <div className={fieldstyle}>
                    <label htmlFor='name' >Full Name</label>
                    <input type='text' id="name" className={getEditorStyle(errors.asset_name)}{...register('asset_name',{
                        required:`You must enter a name for the asset`
                    })}/>
                </div>

                <div className={fieldstyle}>
                    <label htmlFor='price' >Full Name</label>
                    <input type='number' id="price" className={getEditorStyle(errors.asset_price)}{...register('asset_price',{
                        required:`You must enter a price for the asset`
                    })}/>
                </div>

                <div className={fieldstyle}>
                    <label htmlFor='capacity' >Full Name</label>
                    <input type='number' id="capacity" className={getEditorStyle(errors.asset_price)}{...register('tenants_capacity',{
                        required:`You must give a number for maximum possible tenants for the asset.`
                    })}/>
                </div>

                <div className={fieldstyle}>
                    <label htmlFor='description'>Subscription Motivation</label>
                    <input type='text' id="description" {...register('description')}/>
                </div>


                <div className={fieldstyle}>
                    <label htmlFor='email'>e-mail address</label>
                    <input type='email' id ="email" className={getEditorStyle(errors.contact_email)}{...register('contact_email',{
                        required:`You must enter your e-mail address`
                    })}/>
                </div>

                <div className={fieldstyle}>
                    <label htmlFor='asset_website'>One of your social website(Linkedin, Facebook, etc...)</label>
                    <input type='text' id="asset_website"className={getEditorStyle(errors.website)}{...register('website',{
                        required:`You must enter a website for the asset`
                    })}/>
                </div>                

                <div className={fieldstyle}>
                    <label htmlFor='notes'>Additional Informations</label>
                    <input type='text' id="notes" {...register('notes')}/>
                </div>

                <div>
                    <Button 
                    type="submit"
                    className="bg-blue-600 text-white font-bold   text-xl">
                        Submit
                    </Button>
                </div>
            </form>
        </div>
    )
}