'use client';
import { useReadContract } from "thirdweb/react";
import { client } from "./client";
import { getContract } from "thirdweb";
import { CampaignCard } from "@/components/CampaignCard";
import { CROWDFUNDING_FACTORY } from "./constants/contracts";
import { chain } from "./constants/chains";
import Link from 'next/link';

export default function Home() {
  // Get CrowdfundingFactory contract
  const contract = getContract({
    client: client,
    chain: chain,
    address: CROWDFUNDING_FACTORY,
  });

  // Get all campaigns deployed with CrowdfundingFactory
  const { data: campaigns, isLoading: isLoadingCampaigns, refetch: refetchCampaigns } = useReadContract({
    contract: contract,
    method: "function getAllCampaigns() view returns ((address campaignAddress, address owner, string name)[])",
    params: []
  });

  return (
    <main className="mx-auto max-w-7xl px-4 mt-4 sm:px-6 lg:px-8">
   {/* Hero Section */}
<div
  className="text-white py-16 rounded-lg text-center shadow-xl transition-all ease-in-out duration-300 hover:scale-105"
  style={{
    background: `
      linear-gradient(
        to left,
        #4f46e5, #2563eb, #14b8a6, #4f46e5
      )`,
    backgroundSize: "300% 300%",
    animation: "gradientMoveHero 5s ease infinite",
  }}
>
  <h1 className="text-5xl font-extrabold mb-4 tracking-tight">Welcome to ChainImpact</h1>
  <p className="text-lg mb-6 text-opacity-90">
    Empowering your ideas with blockchain transparency and trust. Explore and support campaigns today!
  </p>
  {/* Button Container */}
  <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
    {/* Create Your Campaign Button with Link */}
    <Link href="/dashboard/page">
      <button className="bg-white text-indigo-600 hover:bg-indigo-500 px-8 py-3 font-semibold rounded-lg shadow-lg transition-all ease-in-out duration-300 hover:scale-105">
        Create a campaign
      </button>
    </Link>
    {/* View All Campaign Button with Link */}
    <Link href="/page2">
      <button className="bg-transparent text-white border-2 border-white hover:bg-white hover:text-indigo-600 px-8 py-3 font-semibold rounded-lg shadow-lg transition-all ease-in-out duration-300 hover:scale-105">
        View all campaigns
      </button>
    </Link>
  </div>
</div>

{/* Add this CSS in your global CSS or in a <style> block */}
<style jsx>{`
  @keyframes gradientMoveHero {
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
`}</style>

{/* How It Works Section */}
<section className="py-8  ">
  <h2 className="text-4xl font-bold text-center text-black mb-10">How it Works</h2>
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
    {/* Step 1: Create */}
    <div className="bg-gray-50 p-4 rounded-lg shadow-md transform transition-all hover:scale-105">
      <div className="mb-4 text-indigo-600 text-3xl">
        <span>✍️</span> {/* Icon for 'Create' */}
      </div>
      <h3 className="text-lg font-semibold text-gray-800 mb-2">1. Create</h3>
      <p className="text-sm text-gray-600">Set up your campaign with a clear goal. Share your story with the world.</p>
    </div>

    {/* Step 2: Fund */}
    <div className="bg-gray-50 p-4 rounded-lg shadow-md transform transition-all hover:scale-105">
      <div className="mb-4 text-teal-500 text-3xl">
        <span>💰</span> {/* Icon for 'Fund' */}
      </div>
      <h3 className="text-lg font-semibold text-gray-800 mb-2">2. Fund</h3>
      <p className="text-sm text-gray-600">Contribute securely via blockchain, ensuring transparency and trust.</p>
    </div>

    {/* Step 3: Track */}
    <div className="bg-gray-50 p-4 rounded-lg shadow-md transform transition-all hover:scale-105">
      <div className="mb-4 text-blue-500 text-3xl">
        <span>📊</span> {/* Icon for 'Track' */}
      </div>
      <h3 className="text-lg font-semibold text-gray-800 mb-2">3. Track</h3>
      <p className="text-sm text-gray-600">Monitor progress and see how contributions bring your idea to life.</p>
    </div>
  </div>
</section>
    

      {/* Explore Active Campaigns Section */}
      <div className="my-8 flex justify-between items-center">
        <h2 className="text-3xl font-semibold text-gray-800">Featured Campaigns</h2>
        <select className="border border-gray-300 rounded-lg px-6 py-3 bg-white text-gray-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all ease-in-out duration-300">
          <option value="all">All Categories</option>
          <option value="tech">Technology</option>
          <option value="health">Health</option>
          <option value="education">Education</option>
        </select>
      </div>

      {/* Campaign Section */}
<section className="py-10">
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {!isLoadingCampaigns && campaigns && campaigns.length > 0 ? (
      campaigns
        .slice(0, window.innerWidth < 768 ? 2 : 3) // Show 2 on mobile and 3 on larger screens
        .map((campaign) => (
          <CampaignCard
            key={campaign.campaignAddress}
            campaignAddress={campaign.campaignAddress}
          />
        ))
    ) : (
      <p className="text-gray-500 col-span-full text-center">Loading campaigns...</p>
    )}
  </div>
</section>



  {/* Campaign Stats Section
      <section className="py-12 my-4">
        <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6"></h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-indigo-600">Total Campaigns</h3>
            <p className="text-3xl font-bold text-gray-800">{campaigns ? campaigns.length : 0}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-indigo-600">Total Funds Donated</h3>
            <p className="text-3xl font-bold text-gray-800">$44,000</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-indigo-600">Total Backers</h3>
            <p className="text-3xl font-bold text-gray-800">21</p>
          </div>
        </div>
      </section> */}


      {/* Success Stories Section */}
<section className="py-16 my-8 bg-gradient-to-r from-indigo-600 via-blue-500 to-teal-400 rounded-lg shadow-lg">
  <h2 className="text-4xl font-bold text-center text-white mb-10">Success Stories</h2>
  <div className="flex flex-wrap justify-center items-center gap-10">
    {/* Story 1 */}
    <div className="w-80 bg-white rounded-lg p-6 shadow-lg transform transition-all hover:scale-105 hover:shadow-2xl">
      <div className="flex items-center gap-4">
        {/* Optional Icon or Image */}
        <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white">
          <span className="text-xl font-semibold">💡</span>
        </div>
        <h3 className="text-2xl font-semibold text-indigo-600">Tech for Good</h3>
      </div>
      <p className="text-gray-700 mt-4">This campaign raised $50,000 to bring innovative tech solutions to underserved communities, improving lives and creating opportunities.</p>
    </div>
    
    {/* Story 2 */}
    <div className="w-80 bg-white rounded-lg p-6 shadow-lg transform transition-all hover:scale-105 hover:shadow-2xl">
      <div className="flex items-center gap-4">
        {/* Optional Icon or Image */}
        <div className="w-10 h-10 bg-teal-500 rounded-full flex items-center justify-center text-white">
          <span className="text-xl font-semibold">🩺</span>
        </div>
        <h3 className="text-2xl font-semibold text-teal-500">Health for All</h3>
      </div>
      <p className="text-gray-700 mt-4">A successful campaign raising funds for medical equipment to support remote clinics, improving healthcare accessibility in rural areas.</p>
    </div>
  </div>
</section>


      {/* Get Involved Section */}
      <section className="py-12 my-8 bg-gray-50 rounded-lg shadow-lg">
        <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">Get Involved</h2>
        <p className="text-center text-lg text-gray-600 mb-4">Join the ChainImpact community to support, create, or fund campaigns. Your involvement can change the world!</p>
        <div className="flex justify-center gap-6">
        <Link href="/dashboard/page">
            <button className="bg-indigo-600 text-white px-8 py-3 font-semibold rounded-lg shadow-lg hover:bg-indigo-700 transition-all ease-in-out duration-300">
              Create a Campaign
            </button>
          </Link>
          <Link href="/page2">
            <button className="bg-teal-600 text-white px-8 py-3 font-semibold rounded-lg shadow-lg hover:bg-teal-700 transition-all ease-in-out duration-300">
              Donate Now
            </button>
          </Link>
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
