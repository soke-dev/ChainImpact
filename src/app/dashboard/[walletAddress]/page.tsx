'use client';
import { client } from "@/app/client";
import { CROWDFUNDING_FACTORY } from "@/app/constants/contracts";
import { MyCampaignCard } from "@/components/MyCampaignCard";
import { useState } from "react";
import { getContract } from "thirdweb";
import { chain } from "@/app/constants/chains";
import { deployPublishedContract } from "thirdweb/deploys";
import { useActiveAccount, useReadContract } from "thirdweb/react";

export default function DashboardPage() {
    const account = useActiveAccount();
    
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    const contract = getContract({
        client: client,
        chain: chain,
        address: CROWDFUNDING_FACTORY,
    });

    // Get Campaigns
    const { data: myCampaigns, isLoading: isLoadingMyCampaigns, refetch } = useReadContract({
        contract: contract,
        method: "function getUserCampaigns(address _user) view returns ((address campaignAddress, address owner, string name, uint256 creationTime)[])",
        params: [account?.address as string]
    });

    return (
        <div className="mx-auto max-w-7xl px-4 mt-16 sm:px-6 lg:px-8">
            <div className="flex flex-row justify-between items-center mb-8">
                <h1 className="text-5xl font-bold text-gray-800">Dashboard</h1>
                <button
                    className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-500 transition duration-200"
                    onClick={() => setIsModalOpen(true)}
                >
                    Create Campaign
                </button>
            </div>

            {/* My Campaigns Section */}
            <h2 className="text-3xl font-semibold mb-4 text-gray-700">My Campaigns</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {!isLoadingMyCampaigns ? (
                    myCampaigns && myCampaigns.length > 0 ? (
                        myCampaigns.map((campaign, index) => (
                            <MyCampaignCard
                                key={index}
                                contractAddress={campaign.campaignAddress}
                            />
                        ))
                    ) : (
                        <p className="col-span-full text-lg text-gray-500">No campaigns found.</p>
                    )
                ) : (
                    <p className="col-span-full text-lg text-gray-500">Loading...</p>
                )}
            </div>


   {/* Campaign Statistics Section */}
   <div className="mt-12 p-6">
                <h3 className="text-2xl font-semibold text-gray-800">Wallet Statistics</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-4">
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                        <h4 className="text-xl font-semibold text-gray-700">Total Campaigns Created</h4>
                        <p className="text-2xl text-gray-600">{myCampaigns ? myCampaigns.length : 0}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                        <h4 className="text-xl font-semibold text-gray-700">Active Campaigns</h4>
                        <p className="text-2xl text-gray-600">{myCampaigns ? myCampaigns.length : 0}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                        <h4 className="text-xl font-semibold text-gray-700">Total Funds Raised</h4>
                        {/* <p className="text-2xl text-gray-600">1,000 ETH (Placeholder)</p> */}
                    </div>
                </div>
            </div>
            
    {/* Profile Overview Section */}
    <div className="mt-12 p-6">
                <h3 className="text-2xl font-semibold text-gray-800">Account Info</h3>
                <div className="mt-4 p-4 bg-white rounded-lg shadow-sm">
                    <h4 className="text-xl font-semibold text-gray-700"></h4>
                    {/* <p className="text-gray-600">Username: {account?.address}</p> */}
                    <div className="text-gray-600 font-semibold">
    <p 
        className="truncate max-w-full" 
        title={account?.address} // Displays full address on hover
    >
        Wallet Address: {account?.address}
    </p>
    <button className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md shadow-md hover:scale-105 transition-all">
        Action
    </button>
</div>

                </div>
            </div>

         

           

        
            {isModalOpen && (
                <CreateCampaignModal
                    setIsModalOpen={setIsModalOpen}
                    refetch={refetch}
                />
            )}
        </div>
    );
}

type CreateCampaignModalProps = {
    setIsModalOpen: (value: boolean) => void;
    refetch: () => void;
};

const CreateCampaignModal = ({ setIsModalOpen, refetch }: CreateCampaignModalProps) => {
    const account = useActiveAccount();
    const [isDeployingContract, setIsDeployingContract] = useState<boolean>(false);
    const [campaignName, setCampaignName] = useState<string>("");
    const [campaignDescription, setCampaignDescription] = useState<string>("");
    const [campaignGoal, setCampaignGoal] = useState<number>(1);
    const [campaignDeadline, setCampaignDeadline] = useState<number>(1);
    
    const handleDeployContract = async () => {
        setIsDeployingContract(true);
        try {
            console.log("Creating campaign...");
            const contractAddress = await deployPublishedContract({
                client: client,
                chain: chain,
                account: account!,
                contractId: "Crowdfunding",
                contractParams: [
                    campaignName,
                    campaignDescription,
                    campaignGoal,
                    campaignDeadline
                ],
                publisher: "0x5BCC254Baa2e7974598a77404Ac4Ca51fd401A0d",
                version: "1.0.2",
            });
            alert("Campaign Created successfully!");
        } catch (error) {
            console.error(error);
        } finally {
            setIsDeployingContract(false);
            setIsModalOpen(false);
            refetch();
        }
    };

    const handleCampaignGoal = (value: number) => {
        setCampaignGoal(Math.max(value, 1));
    };

    const handleCampaignLengthChange = (value: number) => {
        setCampaignDeadline(Math.max(value, 1));
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center backdrop-blur-sm">
            <div className="w-full max-w-lg bg-white rounded-lg shadow-lg p-8">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Create a Campaign</h2>
                    <button
                        className="text-sm px-3 py-1 bg-gray-600 text-white rounded-md hover:bg-gray-500"
                        onClick={() => setIsModalOpen(false)}
                    >
                        Close
                    </button>
                </div>
                <div className="flex flex-col space-y-4">
                    <label className="font-medium">Campaign Name:</label>
                    <input 
                        type="text" 
                        value={campaignName}
                        onChange={(e) => setCampaignName(e.target.value)}
                        placeholder="Enter campaign name"
                        className="px-4 py-2 border rounded-md shadow-sm"
                    />
                    <label className="font-medium">Description:</label>
                    <textarea 
                        value={campaignDescription}
                        onChange={(e) => setCampaignDescription(e.target.value)}
                        placeholder="Enter description"
                        className="px-4 py-2 border rounded-md shadow-sm"
                    />
                    <label className="font-medium">Campaign Goal (USDT):</label>
                    <input 
                        type="number"
                        value={campaignGoal}
                        onChange={(e) => handleCampaignGoal(Number(e.target.value))}
                        className="px-4 py-2 border rounded-md shadow-sm"
                    />
                    <label className="font-medium">Deadline (Days):</label>
                    <input 
                        type="number"
                        value={campaignDeadline}
                        onChange={(e) => handleCampaignLengthChange(Number(e.target.value))}
                        className="px-4 py-2 border rounded-md shadow-sm"
                    />
                    <button 
                        className="mt-4 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-500"
                        onClick={handleDeployContract}
                        disabled={isDeployingContract}
                    >
                        {isDeployingContract ? "Creating..." : "Create Campaign"}
                    </button>
                </div>
            </div>
           
        </div>
        
    );
};
