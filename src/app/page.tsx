"use client";
import React, { useState } from 'react';
import Tesseract from 'tesseract.js';

export default function Home() {
  const [imageText, setImageText] = useState('');
  const [loading, setLoading] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [fileInfo, setFileInfo] = useState<{ name: string; size: number; url: string } | null>(null);

  const handleImageUpload = (e: { target: { files: any[]; }; }) => {
    const file = e.target.files[0];

    if (file) {
      setFileInfo({
        name: file.name,
        size: file.size,
        url: URL.createObjectURL(file),
      });
    }
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(imageText);
    setShowNotification(true);

    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
  };

  const handleFormSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();

    if (fileInfo) {
      setLoading(true);

      Tesseract.recognize(fileInfo.url, 'eng', {
        logger: (info) => info,
      }).then(({ data: { text } }) => {
        setImageText(text);
        setLoading(false);
      });
    }
  };

  return (
    <main className='min-h-screen items-center justify-between p-2 md:p-24 md:flex'>
      <section className='container mx-auto items-center py-2 md:py-32 w-full md:w-1/2'>
        <div className='max-w-sm mx-auto bg-white rounded-lg shadow-md overflow-hidden items-center'>
          <div className='px-4 py-6'>
            <form onSubmit={handleFormSubmit}>
              <div
                className={`max-w-sm p-6 mb-4 ${
                  fileInfo
                    ? 'border-none'
                    : 'bg-gray-100 border-dashed border-2 border-gray-400 rounded-lg'
                } items-center mx-auto text-center cursor-pointer`}
                onClick={() => document.getElementById('upload')?.click()}
              >
                <>
                  <input
                    id='upload'
                    type='file'
                    className='hidden'
                    accept='image/*'
                    onChange={handleImageUpload as any}
                  />
                  <label htmlFor='upload' className='cursor-pointer'>
                    <span
                      id='filename'
                      className='text-gray-500 bg-gray-200 z-50'
                    >
                      {fileInfo ? (
                        <>
                          <span className='font-bold'>{fileInfo.name}</span>
                          <span className='text-xs text-gray-400'>
                            {' '}
                            ({fileInfo.size} bytes)
                          </span>
                        </>
                      ) : (
                        <label htmlFor='upload' className='cursor-pointer'>
                          <svg
                            xmlns='http://www.w3.org/2000/svg'
                            fill='none'
                            viewBox='0 0 24 24'
                            strokeWidth='1.5'
                            stroke='currentColor'
                            className='w-8 h-8 text-gray-700 mx-auto mb-4'
                          >
                            <path
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              d='M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5'
                            />
                          </svg>
                          <h5 className='mb-2 text-xl font-bold tracking-tight text-gray-700'>
                            Upload a picture
                          </h5>
                          <p className='font-normal text-sm text-gray-400 md:px-6'>
                            Choose a photo with a size less than{' '}
                            <b className='text-gray-600'>2MB</b>
                          </p>
                          <p className='font-normal text-sm text-gray-400 md:px-6'>
                            and in{' '}
                            <b className='text-gray-600'>JPG, PNG, or GIF</b>{' '}
                            format.
                          </p>
                          <span
                            id='filename'
                            className='text-gray-500 bg-gray-200 z-50'
                          ></span>
                        </label>
                      )}
                    </span>
                  </label>
                </>
              </div>
              <div className='flex items-center justify-center'>
                <div className='w-full'>
                  <button
                    type='submit'
                    className={`w-full text-white bg-[#050708] hover:bg-[#050708]/90 focus:ring-4 focus:outline-none focus:ring-[#050708]/50 font-medium rounded-lg text-sm px-5 py-2.5 flex items-center justify-center mr-2 mb-2 cursor-pointer ${
                      loading || !fileInfo
                        ? 'opacity-50 cursor-not-allowed'
                        : ''
                    }`}
                    disabled={loading || !fileInfo}
                  >
                    {loading ? 'Analyzing...' : 'Submit'}
                    {loading && (
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        className='animate-spin ml-2 h-5 w-5 text-white'
                        viewBox='0 0 24 24'
                        fill='none'
                      >
                        <circle
                          className='opacity-25'
                          cx='12'
                          cy='12'
                          r='10'
                          stroke='currentColor'
                          strokeWidth='4'
                        ></circle>
                        <path
                          className='opacity-75'
                          fill='currentColor'
                          d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z'
                        ></path>
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>
      <section className='w-full md:w-1/2'>
        <div className='max-w-sm mx-auto bg-white rounded-lg shadow-md overflow-hidden items-center'>
          <div className='px-4 py-6'>
            <div className='max-w-sm p-6 mb-4 bg-gray-100 border-dashed border-2 border-gray-400 rounded-lg'>
              {loading ? (
                'Analyzing image...'
              ) : (
                <span className='text-gray-700 font-semibold'>
                  {imageText || 'Result will be displayed here'}
                </span>
              )}
            </div>
            <div className='flex items-center justify-center'>
              <div className='w-full'>
                <button
                  onClick={handleCopyText}
                  className={`w-full text-white bg-green-500 hover:bg-green-600 focus:ring-4 focus:outline-none focus:ring-green-500/50 font-medium rounded-lg text-sm px-5 py-2.5 flex items-center justify-center mr-2 mb-2 cursor-pointer ${
                    !imageText ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  disabled={!imageText}
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth='1.5'
                    stroke='currentColor'
                    className='w-5 h-5 mr-1'
                  >
                    <path d='M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2'></path>
                    <rect x='8' y='2' width='8' height='4' rx='1' ry='1'></rect>
                  </svg>
                  <span className='text-center ml-2'>Copy</span>
                  </button>
               
              </div>
            </div>
            {showNotification && (
              <div className='fixed bottom-0 mb-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white py-2 px-4 rounded-md text-center'>
                Text copied to clipboard!
              </div>
            )}
          </div>
        </div>
      </section>
      {/* footer cc by adam */}
    </main>
  );
}
