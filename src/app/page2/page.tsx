'use client';
import { useReadContract } from "thirdweb/react";
import { client } from "@/app/client";
import { getContract } from "thirdweb";
import { CampaignCard } from "@/components/CampaignCard";
import { CROWDFUNDING_FACTORY } from "@/app/constants/contracts";
import { chain } from "@/app/constants/chains";
import Link from 'next/link';
import { useState } from 'react';
import { FaFilter, FaSearch } from 'react-icons/fa';

export default function page2() {
  // Get CrowdfundingFactory contract
  const contract = getContract({
    client: client,
    chain: chain,
    address: CROWDFUNDING_FACTORY,
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [isOpen, setIsOpen] = useState(false); // Dropdown state

  // Get all campaigns deployed with CrowdfundingFactory
  const { data: campaigns, isLoading: isLoadingCampaigns, refetch: refetchCampaigns } = useReadContract({
    contract: contract,
    method: "function getAllCampaigns() view returns ((address campaignAddress, address owner, string name)[])",
    params: []
  });

  // Toggle filter dropdown visibility
  const toggleDropdown = () => setIsOpen(!isOpen);

  return (
    <main className="mx-auto max-w-7xl px-4 mt-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-600 via-blue-500 to-teal-400 text-white py-16 rounded-lg text-center shadow-xl transition-all ease-in-out duration-300 hover:scale-105">
        <h1 className="text-5xl font-extrabold mb-4 tracking-tight">Discover & Support Campaigns</h1>
        <p className="text-lg mb-6 text-opacity-90">Find and contribute to meaningful projects that inspire change.</p>
        {/* Create Your Campaign Button with Link */}
        <Link href="/dashboard/page">
          <button className="bg-white text-indigo-600 hover:bg-indigo-500 px-8 py-3 font-semibold rounded-lg shadow-lg transition-all ease-in-out duration-300 hover:scale-105">
            Create Yours
          </button>
        </Link>
      </div>

      {/* How to Join a Campaign Section */}
<section className="py-8 md:block hidden">
  <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">Joining a Campaign</h2>
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
    {/* Step 1: Click Participate */}
    <div className="bg-gray-50 p-4 rounded-lg shadow-md transform transition-all hover:scale-105">
      <div className="mb-4 text-indigo-600 text-3xl">
        <span>👇</span> {/* Icon for 'Click Participate' */}
      </div>
      <h3 className="text-lg font-semibold text-gray-800 mb-2">Step 1. Select a campaign</h3>
      <p className="text-sm text-gray-600">Navigate to the campaign you want to support and click the join campaign button to get started.</p>
    </div>

    {/* Step 2: Select Your Tier */}
    <div className="bg-gray-50 p-4 rounded-lg shadow-md transform transition-all hover:scale-105">
      <div className="mb-4 text-teal-500 text-3xl">
        <span>🎯</span> {/* Icon for 'Select Your Tier' */}
      </div>
      <h3 className="text-lg font-semibold text-gray-800 mb-2">Step 2. Select Tier</h3>
      <p className="text-sm text-gray-600">Choose the funding tier that fits your contribution goals. Each tier is designed to accommodate different levels of support</p>
    </div>

    {/* Step 3: Confirm Your Transaction */}
    <div className="bg-gray-50 p-4 rounded-lg shadow-md transform transition-all hover:scale-105">
      <div className="mb-4 text-blue-500 text-3xl">
        <span>💰</span> {/* Icon for 'Confirm Your Transaction' */}
      </div>
      <h3 className="text-lg font-semibold text-gray-800 mb-2">Step 3. Fund Campaign</h3>
      <p className="text-sm text-gray-600">
        After selecting your preferred tier, securely complete your contribution to help bring the campaign to life. Your support will make a tangible difference.
      </p>
    </div>
  </div>
</section>

{/* Campaign Stats Section */}
<section className="py-6 my-4 md:block hidden">
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
    <div className="bg-gray-50 p-4 rounded-md shadow-sm hover:shadow-md transition-transform transform hover:scale-105">
      <h3 className="text-sm font-medium text-indigo-500">Total Campaigns</h3>
      <p className="text-xl font-semibold text-gray-800">{campaigns ? campaigns.length : 0}</p>
    </div>
    <div className="bg-gray-50 p-4 rounded-md shadow-sm hover:shadow-md transition-transform transform hover:scale-105">
      <h3 className="text-sm font-medium text-indigo-500">Fully Funded Campaigns</h3>
      <p className="text-xl font-semibold text-gray-800">2</p>
    </div>
    <div className="bg-gray-50 p-4 rounded-md shadow-sm hover:shadow-md transition-transform transform hover:scale-105">
      <h3 className="text-sm font-medium text-indigo-500">Active Campaigns</h3>
      <p className="text-xl font-semibold text-gray-800">5</p>
    </div>
  </div>
</section>


      {/* Explore Campaigns Section */}
      <div className="my-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <h2 className="text-2xl md:text-3xl font-semibold text-gray-800">All Campaigns</h2>
        <div className="flex items-center gap-4 w-full md:w-auto">
          {/* Search Box */}
          <div className="relative w-full md:w-auto">
            <input
              type="text"
              placeholder="Search campaigns"
              className="border border-gray-300 rounded-md px-4 py-2 w-full focus:ring-2 focus:ring-indigo-500 focus:outline-none text-gray-800 placeholder-gray-500 transition-all ease-in-out duration-300"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <FaSearch className="absolute top-1/2 transform -translate-y-1/2 right-3 text-gray-500" />
          </div>

          {/* Filter Icon with Dropdown */}
          <div className="relative flex items-center gap-2">
            <FaFilter className="text-gray-500 text-xl cursor-pointer" onClick={toggleDropdown} />
            {isOpen && (
              <div className="absolute top-8 right-0 bg-white shadow-lg rounded-lg border border-gray-300 p-2 w-40 z-10">
                <select
                  className="w-full bg-white text-gray-800 border-none outline-none"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                >
                  <option value="all">All Campaigns</option>
                  <option value="active">Active</option>
                  <option value="funded">Funded</option>
                  <option value="failed">Failed</option>
                </select>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Campaign Section */}
      <section className="py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {!isLoadingCampaigns && campaigns && campaigns.length > 0 ? (
            campaigns.map((campaign) => (
              <CampaignCard
                key={campaign.campaignAddress}
                campaignAddress={campaign.campaignAddress}
              />
            ))
          ) : (
            <p className="text-gray-500 col-span-3 text-center">Loading Campaigns...</p>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-10 py-6 border-t text-gray-600">
        <div className="flex justify-between items-center">
          <p>© 2024 ChainImpact. All Rights Reserved.</p>
          <div className="flex space-x-6">
            <a href="/" className="text-gray-600 hover:text-indigo-600 transition-all ease-in-out duration-300">About Us</a>
            <a href="/" className="text-gray-600 hover:text-indigo-600 transition-all ease-in-out duration-300">Contact</a>
            <a href="/" className="text-gray-600 hover:text-indigo-600 transition-all ease-in-out duration-300">FAQs</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
