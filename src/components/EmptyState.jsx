import React from 'react';
import {motion} from 'framer-motion';
import {GradientIcon} from './GradientIcon';
import {Button,Card} from './ui';

export function EmptyState({name='Compass',icon:Icon,tone='sky',title,description,actionText,onAction}){return <motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}}><Card className="mx-auto my-6 flex max-w-lg flex-col items-center p-10 text-center">{Icon?<span className="grid h-[68px] w-[68px] place-items-center rounded-2xl bg-[#D8E8F4]"><Icon size={30} className="text-[#3986b5]"/></span>:<GradientIcon name={name} tone={tone} tileSize={68} size={30}/>}<h3 className="display-font mb-2 mt-5 text-xl font-extrabold">{title}</h3><p className="mb-6 text-sm leading-6 text-[#6b665e] dark:text-[#c8c1b6]">{description}</p>{actionText&&onAction&&<Button onClick={onAction} showArrow>{actionText}</Button>}</Card></motion.div>;}
