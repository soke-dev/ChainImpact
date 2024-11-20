import { client } from "@/app/client";
import Link from "next/link";
import { getContract } from "thirdweb";
import { chain } from "@/app/constants/chains";
import { useReadContract } from "thirdweb/react";
import { FaThumbsUp, FaThumbsDown, FaExternalLinkAlt } from "react-icons/fa";
import { useState } from "react";
import { FaRegStickyNote } from "react-icons/fa";

type CampaignCardProps = {
    campaignAddress: string;
};

export const CampaignCard: React.FC<CampaignCardProps> = ({ campaignAddress }) => {
    const [isVoting, setIsVoting] = useState(false);

    const contract = getContract({
        client: client,
        chain: chain,
        address: campaignAddress,
    });

    // Fetching campaign details
    const { data: campaignName, isLoading: isLoadingName } = useReadContract({
        contract: contract,
        method: "function name() view returns (string)",
        params: []
    });

    const { data: campaignDescription, isLoading: isLoadingDescription } = useReadContract({
        contract: contract,
        method: "function description() view returns (string)",
        params: []
    });

    const { data: goal, isLoading: isLoadingGoal } = useReadContract({
        contract: contract,
        method: "function goal() view returns (uint256)",
        params: [],
    });

    const { data: balance, isLoading: isLoadingBalance } = useReadContract({
        contract: contract,
        method: "function getContractBalance() view returns (uint256)",
        params: [],
    });

    // Fetching the campaign owner’s address
    const { data: ownerAddress, isLoading: isLoadingOwner } = useReadContract({
        contract: contract,
        method: "function owner() view returns (address)",
        params: [],
    });

    // Fetching the deadline (assuming it's stored as a uint256 timestamp)
    const { data: deadline, isLoading: isLoadingDeadline } = useReadContract({
        contract: contract,
        method: "function deadline() view returns (uint256)",  // Assuming the contract has a "deadline" function
        params: [],
    });

    if (isLoadingName || isLoadingDescription || isLoadingGoal || isLoadingBalance || isLoadingOwner || isLoadingDeadline) {
        return <div className="text-center text-lg">Loading...</div>;
    }

    // Calculate the funded percentage
    const totalBalance = balance?.toString() || "0";
    const totalGoal = goal?.toString() || "1"; // Avoid division by zero
    let balancePercentage = (parseInt(totalBalance) / parseInt(totalGoal)) * 100;

    // Cap the percentage at 100%
    if (balancePercentage >= 100) {
        balancePercentage = 100;
    }

    // Convert deadline from uint256 timestamp to Date object
    const deadlineDate = deadline ? new Date(parseInt(deadline.toString()) * 1000) : null;

    // Format the date for display
    const formattedDeadline = deadlineDate
        ? deadlineDate.toLocaleDateString('en-US', {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
         
          })
        : "No deadline available";

    const handleVote = (voteType: "up" | "down") => {
        if (isVoting) return;
        setIsVoting(true);

        setTimeout(() => {
            alert(`You voted ${voteType} for campaign ${campaignAddress}`);
            setIsVoting(false);
        }, 500); // Simulate a short delay
    };

    return (
        <div className="flex flex-col justify-between max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow-lg transform transition duration-300 hover:shadow-xl">
            <div className="mb-6">
              {/* Goal and funded progress bar */}
<div className="mb-4">
  <div className="relative w-full h-6 bg-gray-200 rounded-full overflow-hidden">
    {/* Animated gradient */}
    <div
      className="h-6 rounded-full bg-gradient-to-r text-white transition-all duration-500"
      style={{
        width: `${balancePercentage}%`,
        backgroundImage: `
          linear-gradient(
            to right, 
            #2563eb, #0d9488, #2563eb
          )`,
        backgroundSize: "200% auto",
        animation: "gradientMove 5s linear infinite",
      }}
    >
      <span className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-white">
        ${balance?.toString()}
      </span>
    </div>
  </div>
  <p className="mt-2 text-xs text-gray-600">
    {balancePercentage < 100
      ? `${balancePercentage.toFixed(0)}% Funded`
      : "Fully Funded"}
  </p>
</div>

{/* Add this CSS in your global CSS or in a <style> block */}
<style jsx>{`
  @keyframes gradientMove {
    0% {
      background-position: 0% 50%;
    }
    100% {
      background-position: 100% 50%;
    }
  }
`}</style>


                {/* Campaign Name */}
                <h5 className="mb-2 text-2xl font-bold leading-tight tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-pink-blue to-blue-500">
  {campaignName || "Loading..."}
</h5>

                {/* Campaign Description */}
                <p className="mb-4 text-sm text-gray-700">
                    {campaignDescription ? campaignDescription.split(' ').slice(0, 21).join(' ') + (campaignDescription.split(' ').length > 10 ? '...' : '') : 'No description available'}
                </p>

                {/* Goal and Deadline Box */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                    {/* Goal */}
                    <div className="flex flex-col p-3 bg-gray-100 rounded-lg">
                        <p className="text-xs font-semibold text-gray-600">Goal</p>
                        <p className="text-lg font-bold text-gray-800">${goal?.toString()}</p>
                    </div>
                    {/* Deadline */}
                    <div className="flex flex-col p-3 bg-gray-100 rounded-lg">
                        <p className="text-xs font-semibold text-gray-600">End Date</p>
                        <p className="text-lg font-bold text-gray-800">{formattedDeadline}</p>
                    </div>
                </div>
            </div>

         {/* Voting and Reputation Button Section */}
<div className="flex items-center gap-4 mb-6">
    <p className="text-sm font-medium text-gray-600"></p>
    {/* Voting Buttons */}
    <div className="flex items-center gap-3">
        <button
            onClick={() => handleVote("up")}
            className="flex items-center justify-center w-8 h-8 text-green-600 bg-green-100 rounded-full shadow-sm hover:bg-green-200 focus:ring-2 focus:ring-green-300 transition-transform transform hover:scale-105"
            disabled={isVoting}
        >
            <FaThumbsUp size={16} />
        </button>
        <button
            onClick={() => handleVote("down")}
            className="flex items-center justify-center w-8 h-8 text-red-600 bg-red-100 rounded-full shadow-sm hover:bg-red-200 focus:ring-2 focus:ring-red-300 transition-transform transform hover:scale-105"
            disabled={isVoting}
        >
            <FaThumbsDown size={16} />
        </button>
    </div>




               {/* View Creator Reputation Button */}
{ownerAddress && (
    <Link
        href={`https://explorer.ver.ax/linea/search?search_query=${ownerAddress}`}
        passHref
        className="inline-flex items-center px-3 py-2 text-sm font-medium text-blue-600 transition-all duration-200 border border-blue-600 rounded-md hover:bg-blue-600 hover:text-white focus:ring-2 focus:ring-blue-300"
        target="_blank"
    >
        <FaExternalLinkAlt className="w-4 h-4 mr-2" />
        View Creator Attestations
    </Link>
)}

            </div>

            {/* Explanation Text */}
            <div className="mt-2 p-2 bg-gray-100 text-gray-700 text-xs rounded-md shadow-sm max-w-xs">
                Verify the creator’s Decentralized identity on Verax. Wallets with multiple attestations confirm on-chain identity, reducing fraud risk
            </div>

            {/* Join Campaign Button */}
            <Link href={`/campaign/${campaignAddress}`} passHref>
                <p className="inline-flex items-center w-full px-5 py-3 text-sm font-medium text-white transition-transform duration-300 bg-gradient-to-r from-blue-600 to-teal-500 rounded-lg hover:scale-105 focus:ring-4 focus:ring-blue-300 mt-4">
                    View Campaign
                    <svg
                        className="rtl:rotate-180 w-4 h-4 ml-2"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 14 10"
                    >
                        <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M1 5h12m0 0L9 1m4 4L9 9"
                        />
                    </svg>
                </p>
            </Link>
        </div>
    );
};
