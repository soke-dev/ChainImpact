import { client } from "@/app/client";
import Link from "next/link";
import { getContract } from "thirdweb";
import { chain } from "@/app/constants/chains";
import { useReadContract } from "thirdweb/react";

type MyCampaignCardProps = {
    contractAddress: string;
};

export const MyCampaignCard: React.FC<MyCampaignCardProps> = ({ contractAddress }) => {
    const contract = getContract({
        client: client,
        chain: chain,
        address: contractAddress,
    });

    // Get Campaign Name
    const { data: name } = useReadContract({
        contract, 
        method: "function name() view returns (string)", 
        params: []
    });

    // Get Campaign Description
    const { data: description } = useReadContract({
        contract, 
        method: "function description() view returns (string)", 
        params: [] 
    });

    // Get Campaign Goal and Funding Progress
    const { data: goal } = useReadContract({
        contract,
        method: "function goal() view returns (uint256)",
        params: []
    });

    const { data: balance } = useReadContract({
        contract,
        method: "function getContractBalance() view returns (uint256)",
        params: []
    });

    // Calculate Funding Percentage
    const balancePercentage = goal && balance ? (parseInt(balance.toString()) / parseInt(goal.toString())) * 100 : 0;

    return (
        <div className="flex flex-col justify-between max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow-lg transition duration-300 hover:shadow-xl">
            <div>
            <h5 className="mb-2 text-2xl font-bold leading-tight tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-blue-500 to-blue-500 truncate">
  {name || "Loading..."}
</h5>

                
                <p className="mb-4 text-sm text-gray-600 line-clamp-3">{description || "Loading description..."}</p>

                {/* Goal and Funding Progress */}
                {goal && balance && (
                    <div className="mb-4">
                        <div className="relative w-full h-6 bg-gray-200 rounded-full">
                            <div
                                className="h-6 rounded-full bg-gradient-to-r from-blue-600 to-teal-500 transition-all duration-500"
                                style={{ width: `${balancePercentage}%` }}
                            >
                                <span className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-white">
                                    ${balance?.toString()} / ${goal?.toString()}
                                </span>
                            </div>
                        </div>
                        <p className="mt-2 text-xs text-gray-600">
                            {balancePercentage < 100 ? `${balancePercentage.toFixed(0)}% Funded` : "Fully Funded"}
                        </p>
                    </div>
                )}
                
                {/* Deadline */}
                <div className="mb-4 text-sm text-gray-600">
                    <span className="font-semibold">End Date:</span> { /* Add deadline here */ }
                </div>
            </div>

            <Link href={`/campaign/${contractAddress}`} passHref>
                <p className="inline-flex items-center justify-center px-4 py-2 mt-4 text-sm font-medium text-white transition-transform duration-300 bg-gradient-to-r from-blue-600 to-teal-500 rounded-lg hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300">
                    View Campaign
                    <svg className="rtl:rotate-180 w-4 h-4 ml-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
                    </svg>
                </p>
            </Link>
        </div>
    );
};
