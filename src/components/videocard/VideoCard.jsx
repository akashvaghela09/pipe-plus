import React, { useEffect, useState } from 'react'
import { TiTick } from 'react-icons/ti';
import { formatTime, formatNumbers, formatReadableDate, isValid } from '../../utils';

export const VideoCard = ({ video }) => {
    const {
        title,
        duration,
        thumbnail,
        thumbnailUrl,
        uploaded,
        uploadDate,
        uploadedDate,
        uploaderAvatar,
        uploaderName,
        uploader,
        // uploaderUrl, 
        uploaderVerified,
        url,
        views
    } = video;

    return (
        <div className='w-full'>
            <div className='relative w-full rounded-xl'>
                <img
                    loading='lazy'
                    src={thumbnail ? thumbnail : thumbnailUrl}
                    className='w-full aspect-video lg:rounded-xl z-10 cursor-pointer'
                />
                <p className='absolute bottom-1 right-1 px-1 rounded-md text-sm text-slate-50 bg-black'>{formatTime(duration)}</p>
            </div>
            <div className='flex p-3 gap-3 lg:gap-2 py-2'>
                <img loading='lazy' src={uploaderAvatar} className='w-10 h-10 rounded-full' />
                <div className='flex flex-col grow'>
                    <p className='text-slate-50 line-clamp-2 leading-6'>{title}</p>
                    <span className='text-slate-100 opacity-50 text-xs flex lg:hidden'>
                        <p className='line-clamp-1'>{uploaderName === undefined ? uploader : uploaderName}</p>
                        <p className='px-2'>•</p>
                        <p className='whitespace-nowrap'>{formatNumbers(views)} views</p>
                        <p className='px-2'>•</p>
                        <p className='whitespace-nowrap'>{uploadedDate ? uploadedDate : uploaded ? formatReadableDate(uploaded) : formatReadableDate(uploadDate)}</p>
                    </span>
                    <div className='hidden lg:flex flex-col'>
                        <div className='flex items-center justify-start gap-2'>
                            <p className='text-slate-100 opacity-50 text-sm line-clamp-1 hover:opacity-70 cursor-pointer'>{uploaderName}</p>
                            {
                                uploaderVerified && <TiTick className='text-xs bg-zinc-500 rounded-full' />
                            }

                        </div>
                        <div className='flex items-start justify-start gap-2'>
                            <p className='text-slate-100 opacity-50 text-sm'>{formatNumbers(views)} views</p>
                            {
                                uploadedDate ?
                                    <span className='text-slate-100 opacity-50 text-sm flex gap-2'><p>•</p> {uploadedDate}</span>
                                    :
                                    <span className='text-slate-100 opacity-50 text-sm flex gap-2'><p>•</p> {formatReadableDate(uploaded)}</span>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}