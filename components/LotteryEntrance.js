import { useMoralis, useWeb3Contract } from "react-moralis"
import { abi, contractAddress } from "../constant"
import { chainIdHex } from "web3uikit"
import { useEffect, useState } from "react"
import { ethers } from "ethers"
import { useNotification } from "web3uikit"

export default function LotteryEntrance() {
    const { chainId: chainIdHex, isWeb3Enabled } = useMoralis()
    const chainId = parseInt(chainIdHex)
    const raffleAddress = chainId in contractAddress ? contractAddress[chainId][0] : null
    console.log(parseInt(chainIdHex))
    const [entranceFee, setEntranceFee] = useState("0")
    const [numPlayer, setnumPlayer] = useState("0")
    const [recentWinner, setrecentWinner] = useState("0")

    //let entranceFee = ""

    const dispatch = useNotification()

    const {
        runContractFunction: enterRaffle,
        isLoading,
        isFetching,
    } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "enterRaffle",
        params: {},
        msgValue: entranceFee,
    })

    const { runContractFunction: getEntranceFee } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getEntranceFee",
        params: {},
    })

    const { runContractFunction: getNumberOfPlayers } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getNumberOfPlayers",
        params: {},
    })

    const { runContractFunction: getRecentWinner } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getRecentWinner",
        params: {},
    })

    async function updateUI() {
        const entranceFeeFromCall = (await getEntranceFee()).toString()
        const numberPlayerFromCall = (await getNumberOfPlayers()).toString()
        const recentWinnerFromCall = await getRecentWinner()
        setEntranceFee(entranceFeeFromCall)
        setnumPlayer(numberPlayerFromCall)
        setrecentWinner(recentWinnerFromCall)
        console.log(entranceFee)
    }

    useEffect(() => {
        if (isWeb3Enabled) {
            updateUI()
        }
    }, [isWeb3Enabled])

    const handleSuccess = async function (tx) {
        await tx.wait(1)
        updateUI()
        handleNewNotification(tx)
    }
    const handleNewNotification = function () {
        dispatch({
            type: "info",
            message: "transaction complete",
            title: "tx Notification",
            position: "topR",
            icon: "bell",
        })
    }
    return (
        <div className="p-5">

            Hi From Lottery Entrance


            {raffleAddress ? (
                <div>
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-auto"
                        onClick={async function () {
                            await enterRaffle({
                                onSuccess: handleSuccess,
                                onError: (error) => console.log(error),
                            })
                        }}
                        disabled={isLoading || isFetching}
                    >
                        {isLoading || isFetching ? (
                            <div className="animate-spin spinner-holder h-8 w-8 border-b-2 rounded-full"></div>
                        ) : (
                            <div>Enter Raffle</div>
                        )}
                    </button>
                    <div>Entrance Fee: {ethers.utils.formatUnits(entranceFee, "ether")} ETH Number of</div>
                    <div>Player {numPlayer}</div>
                    <div>Recent Winner {recentWinner}</div>
                    <div>WHAT UPP</div>
                </div>
            ) : (
                <div>No raffle address</div>
            )}
            {/* {raffleAddress ? (
                <div>
                    
                    <button onClick={async function(){
                        await enterRaffle({
                            onSuccess: handleSuccess,
                            onError:(error) => console.log(error),
                        })
                    }}>Enter raffle</button>
                    Entrance Fee: {ethers.utils.formatUnits(entranceFee, "ether")} ETH
                    Number of player {numPlayer}
                    Recent Winner {recentWinner}
                    </div>

            ) : (
                <div>No Raffle Address deteched</div>
            )} */}
        </div>
    )
}
