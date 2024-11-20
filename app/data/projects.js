// src/data/projects.js

const projects = [
    {
        url: "/images/meeting2.avif",
        gifUrl: "/images/chronic-placeholder.avif",
        title: "Chronic Pain Recovery",
        link: "http://chronicpainrecovery.netlify.app",
        id: 1,
        comingSoon: false,
    },
    {
        url: "/images/smile-3.avif",
        gifUrl: "/images/everyrun-placeholder.avif",
        title: "EveryRun Club",
        link: "https://everyrunclub.netlify.app",
        id: 2,
        comingSoon: false,
    },
    // {
    //     url: "/images/nexaflow.avif",
    //     gifUrl: "/images/nexaflow-placeholder.avif",
    //     title: "Nexaflow",
    //     link: "https://nexaflow.netlify.app",
    //     id: 3,
    //     comingSoon: false,
    // },
    {
        id: 3,
        title: "More to come",
        url: "", // Not needed for coming soon card
        gifUrl: "", // Not needed for coming soon card
        link: "#",
        comingSoon: true, // Add this flag
    },
]

export default projects
