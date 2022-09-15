import {ConnectButton, connectButton} from "web3uikit"
export default function Header() {
    return (
        <div className="p-5 border-b-2 flex flex-row">
            <h1 className="py-4 px-6 front_block text-3xl">Decentralize Lottery </h1>
            <div className="ml-auto py-2 px-4"></div>
            <ConnectButton moralisAuth={false}/>
        </div>
    )
}