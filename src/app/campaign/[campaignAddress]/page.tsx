"use client";
import { client } from "@/app/client";
import { TierCard } from "@/components/TierCard";
import { useParams } from "next/navigation";
import { FaExternalLinkAlt, FaHandHoldingUsd } from 'react-icons/fa';
import { useState, useEffect } from "react";
import {
  getContract,
  prepareContractCall,
  ThirdwebContract,
} from "thirdweb";
import { chain } from "@/app/constants/chains";
import {
  lightTheme,
  TransactionButton,
  useActiveAccount,
  useReadContract,
} from "thirdweb/react";
import {
  FaTwitter,
  FaWhatsapp,
  FaTelegram,
  FaDiscord,
  FaLink,
} from "react-icons/fa";
import Link from "next/link";

export default function CampaignPage() {
  const account = useActiveAccount();
  const { campaignAddress } = useParams();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<string>("");

  const contract = getContract({
    client: client,
    chain: chain,
    address: campaignAddress as string,
  });

  const { data: name, isLoading: isLoadingName } = useReadContract({
    contract: contract,
    method: "function name() view returns (string)",
    params: [],
  });

  const { data: description } = useReadContract({
    contract,
    method: "function description() view returns (string)",
    params: [],
  });

  // Fetching the campaign owner’s address
  const { data: ownerAddress, } = useReadContract({
    contract: contract,
    method: "function owner() view returns (address)",
    params: [],
});

  const { data: deadline, isLoading: isLoadingDeadline } = useReadContract({
    contract: contract,
    method: "function deadline() view returns (uint256)",
    params: [],
  });

  const deadlineDate = new Date(parseInt(deadline?.toString() as string) * 1000);
  const hasDeadlinePassed = deadlineDate < new Date();

  const calculateTimeLeft = () => {
    const now = new Date();
    const difference = deadlineDate.getTime() - now.getTime();
    if (difference > 0) {
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);
      return `${days}d ${hours}h ${minutes}m ${seconds}s`;
    } else {
      return "Campaign Ended";
    }
  };

  useEffect(() => {
    if (!isLoadingDeadline) {
      const timer = setInterval(() => {
        setTimeLeft(calculateTimeLeft());
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [deadline, isLoadingDeadline]);

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

  const totalBalance = balance?.toString();
  const totalGoal = goal?.toString();
  let balancePercentage =
    (parseInt(totalBalance as string) / parseInt(totalGoal as string)) * 100;

  if (balancePercentage >= 100) {
    balancePercentage = 100;
  }

  const { data: tiers, isLoading: isLoadingTiers } = useReadContract({
    contract: contract,
    method: "function getTiers() view returns ((string name, uint256 amount, uint256 backers)[])",
    params: [],
  });

  const { data: owner, isLoading: isLoadingOwner } = useReadContract({
    contract: contract,
    method: "function owner() view returns (address)",
    params: [],
  });

  const { data: status } = useReadContract({
    contract,
    method: "function state() view returns (uint8)",
    params: [],
  });

  const campaignUrl = `https://chainimpact-psi.vercel.app/campaign/${campaignAddress}`;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-8">
     


            {/* Campaign Instructions Box */}
            <div className="mx-auto max-w-4xl bg-gradient-to-r from-blue-100 to-blue-200 p-6 rounded-xl shadow-lg mb-8 transition-transform transform hover:scale-105">
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">How to fund this campaign</h3>
                <ul className="list-disc pl-6 text-gray-700 space-y-3">
                    <li>Connect your wallet and view the campaign details.</li>
                    <li>Contribute to the campaign by selecting a tier and confirming the transaction.</li>
                    <li>If you are the owner, you can edit the status and manage funding tiers.</li>
                </ul>
            </div>
            <div className="mx-auto max-w-4xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
  {/* Social Sharing Section */}
  <div className="flex items-center space-x-4">
    <p className="text-lg font-semibold">Share this campaign:</p>
    <a
      href={`https://twitter.com/share?url=${encodeURIComponent(campaignUrl)}`}
      target="_blank"
      rel="noopener noreferrer"
      className="text-blue-500 text-xl"
    >
      <FaTwitter />
    </a>
    <a
      href={`https://wa.me/?text=${encodeURIComponent(campaignUrl)}`}
      target="_blank"
      rel="noopener noreferrer"
      className="text-green-500 text-xl"
    >
      <FaWhatsapp />
    </a>
    <a
      href={`https://t.me/share/url?url=${encodeURIComponent(campaignUrl)}`}
      target="_blank"
      rel="noopener noreferrer"
      className="text-blue-400 text-xl"
    >
      <FaTelegram />
    </a>
    <a
      href={`https://discord.com/channels/@me`}
      target="_blank"
      rel="noopener noreferrer"
      className="text-purple-500 text-xl"
    >
      <FaDiscord />
    </a>
    <button
      onClick={() => navigator.clipboard.writeText(campaignUrl)}
      className="text-gray-700 text-xl"
    >
      <FaLink />
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






{/* Campaign Name and Owner Actions */}
<div className="mx-auto flex flex-col items-center mb-6 space-y-4">
  {!isLoadingName && (
    <p
      className="text-4xl font-bold leading-tight tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-blue-500 to-blue-500"
    >
      {name}
    </p>
  )}

  {/* Owner Options */}
  {owner === account?.address && (
    <div className="flex flex-col sm:flex-row items-center sm:items-end justify-center space-y-2 sm:space-y-0 sm:space-x-4 mt-4">
      {isEditing && (
        <p className="px-4 py-2 bg-gray-500 text-white rounded-lg text-sm shadow-md">
          Status: 
          {status === 0
            ? " Active"
            : status === 1
            ? " Successful"
            : status === 2
            ? " Failed"
            : " Unknown"}
        </p>
      )}
      <button
        className="px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-blue-700 rounded-lg shadow-md hover:bg-blue-600 transition-all duration-300"
        onClick={() => setIsEditing(!isEditing)}
      >
        {isEditing ? "Done" : "Edit"}
      </button>
                    </div>
                )}
            </div>
    
        {/* Campaign Description */}
        <div className="my-8 p-6 bg-gradient-to-r from-blue-50 to-teal-50 shadow-xl rounded-lg border border-gray-100 max-w-4xl mx-auto">
  <h2 className="text-3xl font-semibold text-gray-900 mb-6 tracking-tight">Campaign Description</h2>
  <p className="text-gray-700 text-lg leading-relaxed mb-4">
    {description || "Loading description..."}
  </p>
</div>


{/* Campaign Deadline and Countdown */}
{balancePercentage < 100 && (
  <div className="my-8 p-6 bg-gradient-to-r from-blue-50 to-teal-50 shadow-xl rounded-lg border border-gray-100 max-w-4xl mx-auto">
    <h2 className="text-2xl font-bold text-gray-900 mb-4"></h2>
    {!isLoadingDeadline ? (
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
        <p className="text-lg text-gray-700 mb-2 sm:mb-0">
          <span className="font-semibold text-gray-900">End Date:</span> {deadlineDate.toDateString()}
        </p>
        <p className="text-xl font-semibold text-red-600">
          <span className="font-normal text-gray-800">Time Left:</span> {timeLeft}
        </p>
      </div>
    ) : (
      <p className="text-gray-500 italic">Loading deadline...</p>
    )}
  </div>
)}


    
          {/* Campaign Goal and Progress Bar */}
{!isLoadingBalance && (
    <div className="mb-8">
        <p className="text-xl font-semibold text-gray-900 max-w-4xl mx-auto mb-3">
            {balancePercentage >= 100 
                ? `Campaign Fully Funded: $${goal?.toString()}`
                : `Campaign Goal: $${goal?.toString()}`
            }
        </p>
        <div className="relative w-full h-6 bg-gray-200 rounded-full max-w-4xl mx-auto mb-3">
            <div
                className="h-6 rounded-full text-right transition-all duration-500"
                style={{
                    width: `${balancePercentage}%`,
                    background: `linear-gradient(90deg, rgba(0, 123, 255, 1) 0%, rgba(0, 255, 255, 1) 50%, rgba(0, 123, 255, 1) 100%)`,
                    animation: "gradientMovement 2s linear infinite", // Faster animation for more obvious movement
                }}
            >
                <p className="text-white text-xs p-1 pr-3">
                    {balancePercentage >= 100 
                        ? `Amount Raised: $${balance?.toString()}`
                        : `$${balance?.toString()}`
                    }
                </p>
            </div>

            {/* White moving highlight at the tip */}
            <div
                className="absolute top-0 left-0 h-6 rounded-full bg-white opacity-50"
                style={{
                    width: "8px", // Width of the light
                    animation: "movingHighlight 2s ease-in-out infinite", // Animation for the light
                    left: `${balancePercentage}%`, // Position the light at the current progress point
                }}
            />

            <p className="absolute top-0 right-0 text-xs text-grey p-1">
                {balancePercentage >= 100 ? "" : `${balancePercentage.toFixed(1)}%`}
            </p>
        </div>
    </div>
)}

{/* Add the gradient movement and highlight animation */}
<style jsx>{`
    @keyframes gradientMovement {
        0% {
            background-position: 0% 50%;
        }
        50% {
            background-position: 100% 50%;
        }
        100% {
            background-position: 0% 50%;
        }
    }

    @keyframes movingHighlight {
        0% {
            left: 0%;
        }
        50% {
            left: 100%;
        }
        100% {
            left: 0%;
        }
    }
`}</style>


    {/* Dummy Claim Button for Campaign Creator */}
    {owner === account?.address && balancePercentage >= 100 && (
                <div className="mb-8">
                    <button
                        className="flex justify-center mx-auto max-w-4xl px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-green-500 to-green-700 rounded-lg shadow-md hover:bg-green-600 transition-all duration-300"
                        onClick={() => alert("")}
                    >
                        Claim Funds
                    </button>
                </div>
            )}


            <div>
            {/* Fund Campaign Button */}
{balancePercentage < 100 && (
    <div className="flex justify-center mt-4">
        <button 
            className="flex items-center justify-center px-6 py-3 text-2xl font-bold text-grey hover:scale-105 transition-all focus:outline-none"
        >
            <FaHandHoldingUsd className="text-xl mr-3" /> {/* React Icon for donate */}
            <span className="tracking-wide">Fund Campaign</span>
        </button>
    </div>
)}

<div className="flex flex-wrap justify-center gap-4 mx-auto">
    {isLoadingTiers ? (
        <p>Loading...</p>
    ) : (
        tiers && tiers.length > 0 ? (
            tiers.map((tier, index) => (
                <div key={index} className="flex justify-center">
                    <TierCard
                        tier={tier}
                        index={index}
                        contract={contract}
                        isEditing={isEditing}
                    />
                </div>
            ))
        ) : (
            <p>No tiers available</p>
                        )
                    )}
                    {isEditing && (
                        <button
                            className="max-w-sm flex flex-col text-center justify-center items-center font-semibold p-6 bg-blue-500 text-white border border-slate-100 rounded-lg shadow"
                            onClick={() => setIsModalOpen(true)}
                        >+ Add Tier</button>
                    )}
                </div>
            </div>
            
            {isModalOpen && (
                <CreateCampaignModal
                    setIsModalOpen={setIsModalOpen}
                    contract={contract}
                />
            )}
        </div>
    );
}

type CreateTierModalProps = {
    setIsModalOpen: (value: boolean) => void
    contract: ThirdwebContract
}

const CreateCampaignModal = (
    { setIsModalOpen, contract }: CreateTierModalProps
) => {
    const [tierName, setTierName] = useState<string>("");
    const [tierAmount, setTierAmount] = useState<bigint>(1n);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center backdrop-blur-md">
            <div className="w-1/2 bg-slate-100 p-6 rounded-md">
                <div className="flex justify-between items-center mb-4">
                    <p className="text-lg font-semibold">Create a Funding Tier</p>
                    <button
                        className="text-sm px-4 py-2 bg-slate-600 text-white rounded-md"
                        onClick={() => setIsModalOpen(false)}
                    >Close</button>
                </div>
                <div className="flex flex-col">
                    <label>Tier Name:</label>
                    <input 
                        type="text" 
                        value={tierName}
                        onChange={(e) => setTierName(e.target.value)}
                        placeholder="Tier Name"
                        className="mb-4 px-4 py-2 bg-slate-200 rounded-md"
                    />
                    <label>Amount $:</label>
                    <input 
                        type="number"
                        value={parseInt(tierAmount.toString())}
                        onChange={(e) => setTierAmount(BigInt(e.target.value))}
                        className="mb-4 px-4 py-2 bg-slate-200 rounded-md"
                    />
                    <TransactionButton
                        transaction={() => prepareContractCall({
                            contract: contract,
                            method: "function addTier(string _name, uint256 _amount)",
                            params: [tierName, tierAmount]
                        })}
                        onTransactionConfirmed={async () => {
                            alert("Tier added successfully!");
                            setIsModalOpen(false);
                        }}
                    >
                        Create Tier
                    </TransactionButton>
                </div>
            </div>
        </div>
    );
};
