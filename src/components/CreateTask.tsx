import React, {useState} from 'react';
import axios from 'axios'
import {stringify} from "../utils/stringify";
import {BaseError} from "viem";
import {useContractWrite, useWaitForTransaction} from "wagmi";
import {wagmiContractConfig} from "./contracts";

const CreateTask = () => {
    const [uploading, setUploading] = useState(false)
    const {write, data, error, isLoading, isError} = useContractWrite({
        ...wagmiContractConfig,
        functionName: 'createTask',
    })
    const {
        data: receipt,
        isLoading: isPending,
        isSuccess,
    } = useWaitForTransaction({hash: data?.hash})

    const uploadFileToIPFS = async (file: any) => {
        setUploading(true)
        const formData = new FormData()
        formData.append('file', file)
        formData.append('pinataMetadata', JSON.stringify({
            name: file.name
        }))
        formData.append('pinataOptions', JSON.stringify({
            cidVersion: 0,
        }))
        try {
            const res = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
                maxBodyLength: Infinity,
                headers: {
                    'Authorization': `Bearer ${import.meta.env?.VITE_PINATA_API_KEY}`
                }
            });
            setUploading(false)
            return res.data?.IpfsHash
        } catch (error) {
            console.log(error);
        }
    }

    return <>
        <form
            onSubmit={async (e) => {
                e.preventDefault()
                const formData = new FormData(e.target as HTMLFormElement)
                const name = formData.get('name') as string
                const ipfsHash = await uploadFileToIPFS(formData.get('file'))
                write({
                    args: [name, ipfsHash],
                })
            }}
        >
            <input name="name" placeholder="name"/>
            <br/>
            <input type="file" name="file" accept="image/*"/>
            <br/>
            <button disabled={isLoading} type="submit">
                submit
            </button>
        </form>

        {uploading && <div>Uploading...</div>}
        {isLoading && <div>Check wallet...</div>}
        {isPending && <div>Transaction pending...</div>}
        {isSuccess && (
            <>
                <div>Transaction Hash: {data?.hash}</div>
                <div>
                    Transaction Receipt: <pre>{stringify(receipt, null, 2)}</pre>
                </div>
            </>
        )}
        {isError && <div>{(error as BaseError)?.shortMessage}</div>}
    </>
}

export default CreateTask;