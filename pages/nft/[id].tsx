import React from 'react'
import { useAddress, useDisconnect, useMetamask } from "@thirdweb-dev/react";
import { sanityClient, urlFor } from '../../sanity' 
import { Collection } from '../../sanity/typings'
import { GetServerSideProps } from 'next';

interface Props {
    collection: Collection
}


function NFTDropPage({collection}: Props) {

  //AUTH  
  const connectWithMetamask = useMetamask();  
  const address = useAddress();
  const disconnect = useDisconnect();


  return (
    <div className='flex h-screen flex-col lg:grid lg:grid-cols-10'>
        {/* {Left} */}
        <div className='lg:col-span-4 bg-gradient-to-br from-cyan-800 to-rose-500'>
            <div className='flex flex-col items-center justify-center py-2 lg:min-h-screen'>
                <div className='bg-gradient-to-br 
                from-yellow-400 to-purple-600 p-2 rounded-xl'>
                    <img
                    className='w-44 rounded-xl object-cover lg:h-96 lg:w-72'
                    src={urlFor(collection.previewImage).url()} alt='' />

                </div>
                
                 <div className='text-center p-5 space-y-2'>
                    <h1 className='text-4xl font-bond text-white'>
                        {collection.nftCollectionName}
                    </h1>
                    <h2 className='text-xl text-gray-300'>
                        {collection.description}
                    </h2>
                 </div>
            </div>
        </div>


        {/* {Right} */}
        <div className='flex flex-1 flex-col p-12 lg:col-span-6'>
            {/* {Header} */}
            <header className='flex items-center justify-between'>
                <h1 className='w-52 cursor-pointer text-xl font-extralight sm:w-80 '>
                    The {' '}
                   <span className='font-extrabold underline 
                    decoration-pink-600/50'>
                      OvO  
                     </span> {' '}
                    
                    NFT Marketplace
                </h1>

                <button 
                 onClick={() => (address ? disconnect() : connectWithMetamask())} 
                 className='rounded-full bg-rose-400 px-4 py-2 
                 text-xs text-white font-bold lg:px-5 lg:py-3 lg:text-base'>
                  {address ? 'Sign Out' : "Sign In"}  
                </button>
            </header>

            <hr className='my-2 border' />
            {address && (
                <p className='text-center text-small text-rose-400'>
                    You're logged in with wallet {" "}
                    {address.substring(0,5)}...{address.substring(address.length - 5)}
                </p>
            )}

            {/* {Content} */}
            <div className='flex flex-1 flex-col items-center space-y-6 text-center mt-10
              lg:space-y-0 lg:justify-center '>
                <img 
                 className='w-80 object-cover pb-10 lg:h-40'
                 src={urlFor(collection.mainImage).url()} alt='' 
                 />

                <h1 className='text-3xl fond-bold lg:text-5xl lg:fond-extrabold'>
                    {collection.title}
                </h1>

                <p className='pt-2 text-xl text-green-500'>13 / 21 NFT's claimed</p>
            </div>

            {/* {Button} */}
            
            <button className='h-16 bg-red-600  w-full text-white
             fond-bold rounded-full mt-10'>
                Mint NFT (0.01 ETH)
            </button>

        </div>
    </div>
  )
}

export default NFTDropPage

export const getServerSideProps: GetServerSideProps = async ({params}) => {
    const query = `*[_type == 'collection' && slug.current == $id] [0]{
        _id,
       title,
       address,
       description,
       nftCollectionName,
       mainImage{
         asset
       },
       previewImage {
         asset
       },
       slug {
          current
       },
       creator ->  {
           _id,
           name,
           address,
           slug {
             current
           },
       },
     }`  

     const collection = await sanityClient.fetch(query, {
        id: params?.id
     })
     console.log(collection)
   
     if (!collection) {
        return {
            notFound: true
        }
     }

     return {
       props: {
         collection
       }
     } 
}
