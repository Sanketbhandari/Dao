//Import Dependencies and hooks needed for app
import { createContext, useEffect } from 'react'
import {
    useVote,
    useToken,
    useAddress,
    useMetamask,
    useDisconnect,
} from '@thirdweb-dev/react'
import { VoteType } from '@thirdweb-dev/sdk'
import { ethers } from 'ethers'

export const ApeDaoContext = createContext()
export const ApeDaoProvider = ({ children }) => {

    /*
      Step 1. Get User address using thirdwebs hook
      Step 2. Get Token and vote contract instances using thirdwebs hooks
      Step 3. We need way to connect and disconnect from the dapp. 
    */
    const currentUserAddress = useAddress() //Get the address using thirdwebs convenient hooks

    let vote = useVote('0xF6Bb2263e1fb953898857C3D8201BCD073b689fD')
    let token = useToken('0x40a56c4B60f6A0375661D352f1b3Fc22dEf32413')
    let connectWithMetamask = useMetamask();
    let disconnectWallet = useDisconnect();

    useEffect(()=>{
       (async()=>{
        try {
            const delegation = await token.getDelegationOf(currentUserAddress)
            if (delegation === ethers.constants.AddressZero){
                await token.delegateTo(currentUserAddress)
            }
        } catch (error){
            console.log(error.message, 'error')
        }
       })()
    }, [])


    //Get all the proposals in the contract
    const getAllProposals = async () => {
        const proposals = await vote.getAll()
        console.log(proposals)
        return proposals
    }

    //Check if proposal given is executable
    const isExecutable = async id => {
        const canExecute = await vote.canExecute(id)
        return canExecute
    }

    //Check if the user has voted for the given proposal
    const checkIfVoted = async id => {
        const res = await vote.hasVoted(id, currentUserAddress)
        console.log(res, 'has voted')
        return res
    }

    //Create  proposal to mint tokens to the DAO's treasury
    const createProposal = async description => {
        const proposal = await vote.propose(description)
        console.log(proposal)
    }


    //Execute proposal if the proposal is successful
    const executeProposal = async id => {

    }


    //Vote for the proposal and delegate tokens if not already done. 
    const voteFor = async (id, type, reason) => {
        try {
            const delegation = await token.getDelegationOf(currentUserAddress)
            if (delegation === ethers.constants.AddressZero){
                await token.delegateTo(currentUserAddress)
            }
            let voteType
            if (type === 'Against') {
                voteType = VoteType.Against
            } else if (type === 'For'){
                voteType = VoteType.For
            } else {
                voteType = VoteType.Abstain
            }
            const hasVoted = await checkIfVoted(id)
            if (!hasVoted) {
                await vote.vote(id, voteType, reason)
            } else {
                console.log('You have already voted')
            }
        } catch (error){
           console.log(error) 
        }
    }
    return (
        <ApeDaoContext.Provider
            value={{
                getAllProposals,
                isExecutable,
                voteFor,
                createProposal,
                currentUserAddress,
                connectWithMetamask,
                disconnectWallet,
                executeProposal,
            }}
        >
            {children}
        </ApeDaoContext.Provider>
    )
}
