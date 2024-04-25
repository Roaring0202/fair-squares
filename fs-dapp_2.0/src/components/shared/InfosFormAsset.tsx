import {useForm,FieldError} from 'react-hook-form';
import { useAccountContext } from '../../contexts/Account_Context';
import { Button } from 'flowbite-react';

type Details = {
    picture: string;
    fullname: string;
    email: string;
    asset_website: string;
    description: string;
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
        let all_infos:string = `${details.fullname}:${pic}:${details.email}:${details.asset_website}:${details.description}:${details.notes}`;
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
                    <label htmlFor='picture'>Link to Avatar Picture</label>

                    <select 
                    id="picture" 
                    {...register('picture')}>
                    <option value= "../../../APPARTMENTS.png">APPARTMENTS</option>
                    <option value= "../../../HOUSES.png">HOUSES</option>
                    <option value= "../../../OFFICES.png">OFFICES</option>
                    </select>
                </div>
                <div className={fieldstyle}>
                    <label htmlFor='fullname' >Full Name</label>
                    <input type='text' id="fullname" className={getEditorStyle(errors.fullname)}{...register('fullname',{
                        required:`You must enter your full name`
                    })}/>
                </div>
                <div className={fieldstyle}>
                    <label htmlFor='email'>e-mail address</label>
                    <input type='email' id ="email" className={getEditorStyle(errors.email)}{...register('email',{
                        required:`You must enter your e-mail address`
                    })}/>
                </div>
                <div className={fieldstyle}>
                    <label htmlFor='asset_website'>One of your social website(Linkedin, Facebook, etc...)</label>
                    <input type='text' id="asset_website" {...register('asset_website')}/>
                </div>
                <div className={fieldstyle}>
                    <label htmlFor='description'>Subscription Motivation</label>
                    <input type='text' id="description" {...register('description')}/>
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