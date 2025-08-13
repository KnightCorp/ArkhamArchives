interface MediaClubSection {
  id: string;
  title: string;
  description: string;
  image: string;
  status: 'available' | 'coming-soon' | 'locked';
}

interface MediaClubContent {
  sections: MediaClubSection[];
}

export const getMediaClubContent = (tab: string): MediaClubContent => {
  const content: Record<string, MediaClubContent> = {
    learning: {
      sections: [
        {
          id: 'storytelling',
          title: 'Art of Storytelling',
          description: 'Master the craft of narrative through interactive lessons and expert guidance',
          image: 'https://images.unsplash.com/photo-1519791883288-dc8bd696e667?w=800&h=400&fit=crop',
          status: 'available'
        },
        {
          id: 'journalism',
          title: 'Investigative Journalism',
          description: 'Learn advanced research and reporting techniques from industry professionals',
          image: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&h=400&fit=crop',
          status: 'available'
        },
        {
          id: 'digital-media',
          title: 'Digital Media Production',
          description: 'Create compelling content for modern platforms and audiences',
          image: 'https://images.unsplash.com/photo-1492724441997-5dc865305da7?w=800&h=400&fit=crop',
          status: 'locked'
        },
        {
          id: 'media-theory',
          title: 'Media Theory & Analysis',
          description: 'Understand the principles and impact of media in society',
          image: 'https://images.unsplash.com/photo-1517799094725-e3453440724e?w=800&h=400&fit=crop',
          status: 'coming-soon'
        }
      ]
    },
    writing: {
      sections: [
        {
          id: 'creative-writing',
          title: 'Creative Writing Workshop',
          description: 'Develop your unique voice and style through guided exercises',
          image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&h=400&fit=crop',
          status: 'available'
        },
        {
          id: 'screenwriting',
          title: 'Screenwriting Essentials',
          description: 'Learn the art of writing for film and television',
          image: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800&h=400&fit=crop',
          status: 'available'
        },
        {
          id: 'poetry',
          title: 'Poetry & Prose',
          description: 'Express yourself through various literary forms and styles',
          image: 'https://images.unsplash.com/photo-1474932430478-367dbb6832c1?w=800&h=400&fit=crop',
          status: 'coming-soon'
        }
      ]
    },
    films: {
      sections: [
        {
          id: 'film-production',
          title: 'Film Production',
          description: 'Learn the fundamentals of filmmaking from pre to post-production',
          image: 'https://images.unsplash.com/photo-1500940405973-129682bd2795?w=800&h=400&fit=crop',
          status: 'available'
        },
        {
          id: 'cinematography',
          title: 'Cinematography',
          description: 'Master the art of visual storytelling through the lens',
          image: 'https://images.unsplash.com/photo-1492271041499-90f9c4d45c78?w=800&h=400&fit=crop',
          status: 'locked'
        }
      ]
    },
    news: {
      sections: [
        {
          id: 'news-writing',
          title: 'News Writing & Reporting',
          description: 'Develop essential skills for modern journalism',
          image: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&h=400&fit=crop',
          status: 'available'
        },
        {
          id: 'broadcast',
          title: 'Broadcast Journalism',
          description: 'Learn the art of television and radio news presentation',
          image: 'https://images.unsplash.com/photo-1598387181032-a3103a2db5b3?w=800&h=400&fit=crop',
          status: 'coming-soon'
        }
      ]
    },
    competitions: {
      sections: [
        {
          id: 'writing-contests',
          title: 'Writing Competitions',
          description: 'Showcase your talent in various writing categories',
          image: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=400&fit=crop',
          status: 'available'
        },
        {
          id: 'film-festival',
          title: 'Student Film Festival',
          description: 'Submit your films and compete with fellow creators',
          image: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=800&h=400&fit=crop',
          status: 'coming-soon'
        }
      ]
    },
    collaborations: {
      sections: [
        {
          id: 'group-projects',
          title: 'Group Projects',
          description: 'Collaborate with peers on multimedia productions',
          image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=400&fit=crop',
          status: 'available'
        },
        {
          id: 'mentorship',
          title: 'Mentorship Program',
          description: 'Connect with industry professionals for guidance',
          image: 'https://images.unsplash.com/photo-1475506631979-72412c606f4d?w=800&h=400&fit=crop',
          status: 'locked'
        }
      ]
    },
    featured: {
      sections: [
        {
          id: 'student-works',
          title: 'Student Showcase',
          description: 'Explore outstanding works from our community',
          image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&h=400&fit=crop',
          status: 'available'
        },
        {
          id: 'alumni-spotlight',
          title: 'Alumni Spotlight',
          description: 'Success stories and inspirational journeys',
          image: 'https://images.unsplash.com/photo-1511424187101-2aaa60069357?w=800&h=400&fit=crop',
          status: 'available'
        }
      ]
    },
    submissions: {
      sections: [
        {
          id: 'submit-work',
          title: 'Submit Your Work',
          description: 'Share your creative projects with the community',
          image: 'https://images.unsplash.com/photo-1512486130939-2c4f79935e4f?w=800&h=400&fit=crop',
          status: 'available'
        },
        {
          id: 'peer-review',
          title: 'Peer Review System',
          description: 'Give and receive constructive feedback',
          image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=400&fit=crop',
          status: 'coming-soon'
        }
      ]
    }
  };

  return content[tab] || { sections: [] };
};