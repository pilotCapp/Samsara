import { Service } from '../types';

export const services:{[key: string]: Service} = {
    netflix: {
        id: 1,
        name: 'Netflix',
        colors: ["#FF0505","#C50404","#A80000"],
        image: require("../assets/logos/netflix.png")
    },
    disney: {
        
        id: 2,
        name: 'Disney+',
        colors: ["#141450","#142878","#071D43"],
        image: require("../assets/logos/disney.png")
    },
    roku: {
        id: 3,
        name: 'Roku',
        colors: ['#6f1ab1',"#4D008A","#210735"],
        image: require("../assets/logos/roku.png")
    },
    hulu: {
        id: 4,
        name: 'Hulu',
        colors: ['#1CE783',"#00A755","#075A31"],
        image: require("../assets/logos/hulu.png")
    },
    prime: {
        id: 5,
        name: 'Prime',
        colors: ['#00a8e1',"#1399FF","#0059AA"],
        image: require("../assets/logos/prime.png")
    },
    hbo: {
        id: 6,
        name: 'HBO',
        colors: ['#2400FF',"#1800AC","#0F006C"],
        image: require("../assets/logos/max.png")
    },
    apple: {
        id: 7,
        name: 'AppleTv',
        colors: ['#D0D0D0',"#555555","#000000"],
        image: require("../assets/logos/apple.png")
    },
    youtube: {
        id: 8,
        name: 'Youtube',
        colors: ['#FF0000',"#b31217","#282828"],
        image: require("../assets/logos/youtube.png")
    },
    paramount: {
        id: 10,
        name: 'Paramount+',
        colors: ['#2864f0',"#11518a","#0D2C4D"],
        image: require("../assets/logos/paramount.png")
    }, 
    init:{
        id:0,
        name: "Initializing",
        colors: ['#FFFFFF',"#FFFFFF","#FFFFFF"],
        image:{uri: "https://icons8.com/preloaders/preloaders/334/Thin%20filling%20broken%20ring.gif"}
    },
    none:{
        id:100,
        name: "No services selected",
        colors: ['#FFFFFF',"#FFFFFF","#FFFFFF"],
        image: "not-found",
  }};
