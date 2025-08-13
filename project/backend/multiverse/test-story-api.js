import fetch from 'node-fetch';

async function testStoryAPI() {
  try {
    console.log('🧪 Testing Story Generation API...');
    
    // Mock data similar to our Multiverse component
    const testData = {
      people: ['Rhea Sharma', 'Aarav Patel', 'Dev Kumar'],
      events: [
        {
          id: 'event1',
          personId: 'user1',
          timestamp: '2024-03-15T20:42:00Z',
          type: 'post',
          content: 'At the club tonight! Amazing vibes and great music 🎉',
          location: 'The Dark Room, Delhi',
          metadata: { mood: 'excited', visibility: 'public', reactions: 23 }
        },
        {
          id: 'event2',
          personId: 'user2',
          timestamp: '2024-03-15T20:42:00Z',
          type: 'call',
          content: 'Long conversation about weekend plans',
          metadata: { mood: 'concerned', visibility: 'private' }
        },
        {
          id: 'event3',
          personId: 'user3',
          timestamp: '2024-03-15T20:43:00Z',
          type: 'message',
          content: 'Shared some interesting photos from the event in group chat',
          metadata: { mood: 'gossipy', visibility: 'friends' }
        }
      ],
      style: 'narrative'
    };

const response = await fetch('http://localhost:3001/api/generate-story', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });

    console.log('📊 Response status:', response.status);
    
    if (!response.ok) {
      const errorData = await response.text();
      console.error('❌ API Error:', errorData);
      return;
    }

    const { story } = await response.json();
    
    console.log('✅ Story API Test Success!');
    console.log('📖 Generated Story:');
    console.log('='.repeat(50));
    console.log(story);
    console.log('='.repeat(50));
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testStoryAPI();
