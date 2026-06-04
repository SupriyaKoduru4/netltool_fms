export interface VideoItem {
  id: string;
  title: string;
  duration: string;
  date: string;
  size: string;
  format: string;
  url: string;
  thumbnailUrl: string;
  transcript: string;
  blogDraft: string;
  description: string;
}

export const DEFAULT_VIDEOS: VideoItem[] = [
  {
    id: "v1",
    title: "Project Kickoff Meeting",
    duration: "30:00",
    date: "May 17, 2026 10:30 PM",
    size: "45.2 MB",
    format: "MP4 • 1080p",
    url: "https://www.w3schools.com/html/mov_bbb.mp4",
    thumbnailUrl: "/video_thumbnail.png",
    transcript: "Welcome everyone to the Project Kickoff Meeting for the Founder Management System. Today, we are going to cover the project scope, timelines, and align on key milestones. Our objective is to build a premium, state-of-the-art dashboard that founders can use to manage their blogs, projects, videos, and tasks seamlessly. Let's review the milestones...",
    blogDraft: "<h1>Project Kickoff Meeting: Aligning Goals for the Founder Management System</h1><p>We officially kicked off the FMS project! In this post, we summarize the key milestones, tech stack, and goals discussed during our meeting.</p><h2>1. Project Vision</h2><p>Our goal is to build a premium, state-of-the-art dashboard that founders can use to manage their blogs, projects, videos, and tasks seamlessly.</p><h2>2. Next Steps</h2><p>We will start by building the core foundation and styling tokens, followed by page components.</p>",
    description: "Initial alignment meeting with stakeholders regarding design and backend setup."
  },
  {
    id: "v2",
    title: "Roadmap Planning",
    duration: "45:30",
    date: "May 18, 2026 4:00 PM",
    size: "45.2 MB",
    format: "MP4 • 1080p",
    url: "https://www.w3schools.com/html/movie.mp4",
    thumbnailUrl: "/video_thumbnail.png",
    transcript: "In this session, we are planning the roadmap for the next two quarters. We will focus on scaling the video transcoding services and implementing automated AI transcriptions using Whisper models. Let's look at the timeline...",
    blogDraft: "<h1>FMS Roadmap: AI-Powered Transcriptions and Scaling</h1><p>Here is our roadmap for the next two quarters. We are focusing on two major themes: AI-powered transcripts and video transcoding scaling.</p><h2>Key Milestones</h2><ul><li>Q1: Whisper Integration for Transcripts</li><li>Q2: Auto Blog Generation Engine</li></ul>",
    description: "Detailed walkthrough of timelines and product roadmap for the upcoming quarters."
  },
  {
    id: "v3",
    title: "Product Strategy Discussion",
    duration: "25:45",
    date: "May 19, 2026 9:30 AM",
    size: "45.2 MB",
    format: "MP4 • 1080p",
    url: "https://assets.mixkit.co/videos/preview/mixkit-forest-stream-in-the-sunlight-529-large.mp4",
    thumbnailUrl: "/video_thumbnail.png",
    transcript: "We are meeting to define the long-term product strategy. FMS needs to stand out by providing frictionless content creation flows. Founders should be able to go from raw video recording to a polished blog post in one click. That is our core value proposition.",
    blogDraft: "<h1>Product Strategy: One-Click Content Creation for Founders</h1><p>Content creation is hard. FMS makes it easy. Our strategy is simple: let founders record raw videos, and we will handle the rest—from transcripts to published blog posts.</p>",
    description: "Brainstorming core differentiators and value proposition for content generation."
  },
  {
    id: "v4",
    title: "Weekly Sync & Status Report",
    duration: "15:20",
    date: "May 20, 2026 2:15 PM",
    size: "22.8 MB",
    format: "MP4 • 720p",
    url: "https://www.w3schools.com/html/mov_bbb.mp4",
    thumbnailUrl: "/video_thumbnail.png",
    transcript: "Hello team. In this weekly sync, we are going to go over the sprint progress, blockages, and plan for the next sprint. The UI designs are mostly ready. We are starting on the backend integration next week...",
    blogDraft: "<h1>Weekly Sync & Sprint Planning</h1><p>Our weekly status update covering sprint deliverables, blockers, and timelines.</p>",
    description: "Regular status update regarding UI milestones and backend planning."
  },
  {
    id: "v5",
    title: "Design System Walkthrough",
    duration: "12:10",
    date: "May 21, 2026 11:00 AM",
    size: "18.4 MB",
    format: "MP4 • 1080p",
    url: "https://www.w3schools.com/html/movie.mp4",
    thumbnailUrl: "/video_thumbnail.png",
    transcript: "Today we are reviewing the FMS design system tokens. We've established a clean dark sidebar theme, consistent typography using Inter, and standard padding values. Let's look at the component hierarchy...",
    blogDraft: "<h1>FMS Design System and Branding Guidelines</h1><p>A complete walkthrough of FMS typography, colors, layout structures, and styling guidelines.</p>",
    description: "Overview of user interface guidelines and component styles."
  },
  {
    id: "v6",
    title: "Vite Optimization Session",
    duration: "18:45",
    date: "May 22, 2026 3:30 PM",
    size: "30.1 MB",
    format: "MP4 • 1080p",
    url: "https://assets.mixkit.co/videos/preview/mixkit-forest-stream-in-the-sunlight-529-large.mp4",
    thumbnailUrl: "/video_thumbnail.png",
    transcript: "We are profiling the Vite build times. We need to optimize chunk division so that modules like react-quill are dynamically imported. This will drop initial bundle sizes below the warning threshold...",
    blogDraft: "<h1>Optimizing Vite Builds for FMS Dashboard</h1><p>A deep dive into bundler performance, chunk splitting, and speed optimization techniques.</p>",
    description: "Engineering session on improving bundle loading times."
  }
];
