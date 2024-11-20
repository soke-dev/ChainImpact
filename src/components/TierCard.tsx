import { prepareContractCall, ThirdwebContract } from "thirdweb";
import { TransactionButton } from "thirdweb/react";

type Tier = {
    name: string;
    amount: bigint;
    backers: bigint;
};

type TierCardProps = {
    tier: Tier;
    index: number;
    contract: ThirdwebContract;
    isEditing: boolean;
};

export const TierCard: React.FC<TierCardProps> = ({ tier, index, contract, isEditing }) => {
    return (
        <div className="flex flex-col justify-between p-4 bg-gradient-to-r from-blue-100 via-teal-100 to-green-100 border border-transparent rounded-xl shadow-md hover:shadow-lg transition-all w-64 mx-3 mb-4">
            <div className="flex flex-col space-y-3 mb-3">
                {/* Tier Name and Backers */}
                <div className="flex justify-between items-center">
                    <p className="text-lg font-medium text-gray-800">{tier.name}</p>
                    <p className="text-xs font-medium text-gray-600">Backers: {tier.backers.toString()}</p>
                </div>

                {/* Amount */}
                <div className="flex justify-between items-center">
                    <p className="text-xl font-bold text-gray-900">${tier.amount.toString()}</p>
                    <TransactionButton
                        transaction={() =>
                            prepareContractCall({
                                contract: contract,
                                method: "function fund(uint256 _tierIndex) payable",
                                params: [BigInt(index)],
                                value: tier.amount,
                            })
                        }
                        onError={(error) => alert(`Error: ${error.message}`)}
                        onTransactionConfirmed={async () => alert("Funded successfully!")}
                        className=" max-w-[3rem] mx-auto px-4 py-1 text-xs font-medium text-white bg-gradient-to-r from-blue-600 to-teal-500 rounded-md shadow-md hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all"
                    >
                        Donate
                    </TransactionButton>
                </div>
            </div>

            {isEditing && (
                <TransactionButton
                    transaction={() =>
                        prepareContractCall({
                            contract: contract,
                            method: "function removeTier(uint256 _index)",
                            params: [BigInt(index)],
                        })
                    }
                    onError={(error) => alert(`Error: ${error.message}`)}
                    onTransactionConfirmed={async () => alert("Removed successfully!")}
                    className="w-full px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-md shadow-md hover:scale-105 focus:outline-none focus:ring-4 focus:ring-red-300 transition-all"
                >
                    Remove
                </TransactionButton>
            )}
        </div>
    );
};
