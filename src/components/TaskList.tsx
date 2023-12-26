import React from 'react';
import {useContractRead, useWalletClient} from "wagmi";
import {wagmiContractConfig} from "./contracts";

const TaskList = () => {
    const {data: walletClient} = useWalletClient()
    const {data, isRefetching, refetch} = useContractRead({
        ...wagmiContractConfig,
        functionName: 'getTask',
        account: walletClient?.account,
    })

    return <div>
        <ul>
            {data?.map(item => <li key={item.id}>
                <span>id: {item.id.toString()}</span><br/>
                <span>name: {item.name}</span><br/>
                <span>ipfsHash: {item.ipfsHash}</span><br/>
                <img width={200} src={`//${import.meta.env?.VITE_PINATA_GATEWAY_DOMAIN}/ipfs/${item.ipfsHash}`}
                     alt="ipfsImage"/>
            </li>)}
        </ul>
        <button
            disabled={isRefetching}
            onClick={() => refetch()}
            style={{marginLeft: 4}}
        >
            {isRefetching ? 'loading...' : 'refetch'}
        </button>
    </div>
}

export default TaskList;