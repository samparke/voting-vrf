import React, {useContext} from "react";
import {Navigate} from "react-router-dom";
import { EthersContext } from "../context/EthersProvider";

const ProtectedRoute = ({children}) => {
    const {account} = useContext(EthersContext);

    if(!account){
        return <Navigate to="/" replace />;
    }

    return children;
}

export default ProtectedRoute;