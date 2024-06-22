import { Service } from '../types';

export const services:{[key: string]: Service} = {
    netflix: {
        id: 1,
        name: 'Netflix',
        colors: ["#FF0505","#C50404","#A80000"],
    },
    disney: {
        id: 2,
        name: 'Disney+',
        colors: ["#001251","#234889","#3165C1"],
    },
    roku: {
        id: 3,
        name: 'Roku',
        colors: ['#6f1ab1',"#4D008A","#210735"],
    },
    hulu: {
        id: 4,
        name: 'Hulu',
        colors: ['#1CE783',"#00A755","#075A31"],
    },
    prime: {
        id: 5,
        name: 'Prime',
        colors: ['#00a8e1',"#1399FF","#0059AA"],
    },
    hbo: {
        id: 6,
        name: 'HBO',
        colors: ['#2400FF',"#1800AC","#0F006C"],
    },
    apple: {
        id: 7,
        name: 'AppleTv',
        colors: ['#D0D0D0',"#555555","#000000"],
    },
    youtube: {
        id: 8,
        name: 'Youtube',
        colors: ['#FF0000',"#b31217","#282828"],
    },
    paramount: {
        id: 10,
        name: 'Paramount+',
        colors: ['#2864f0',"#11518a","#0D2C4D"],
    }
  };
