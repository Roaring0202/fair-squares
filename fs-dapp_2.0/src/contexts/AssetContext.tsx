import React, { createContext, useContext, useReducer, ReactNode, Children } from 'react';
import { AssetContextState, SellerData, AssetData } from './types';

const initialAsset: AssetContextState = {
    seller: undefined,
    assets: [],
    selected_asset: undefined,
}

type Action = 
| { type: 'SET_SELLER'; payload: SellerData}
| { type: 'SET_ASSETS'; payload: AssetData[]}
| { type: 'SET_SELECTED_ASSET'; payload: AssetData};

function reducer(state:AssetContextState, action:Action): AssetContextState{
    switch(action.type){
        case 'SET_SELLER':
            return { ...state,seller: action.payload};
        case 'SET_ASSETS':
            return { ...state, assets: action.payload};
        case 'SET_SELECTED_ASSET':
            return { ...state,selected_asset: action.payload };
        default:
            return state;
    }
}

type AssetContextType = AssetContextState & {
    dispatch3: React.Dispatch<Action>;
}
const AssetContext = createContext<AssetContextType>({
    ...initialAsset,
    dispatch3:() =>{},
});
type Props = {
    children: ReactNode;
};
export function AssetContextProvider({children}: Props){
    const[{seller,assets,selected_asset},dispatch3]=
    useReducer(reducer,initialAsset);
    return(
        <AssetContext.Provider
        value={{
            seller,
            assets,
            selected_asset,
            dispatch3,
        }}
        >
        {children}
        </AssetContext.Provider>
    );
}

export const useAssetContext = () => useContext(AssetContext);