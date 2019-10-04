


const sampleData = {

    events: [
        {
          id: '1',
          title: 'Trip to Tower of London',
          date: '2018-03-27T18:00:00',
          category: 'culture',
          description:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus sollicitudin ligula eu leo tincidunt, quis scelerisque magna dapibus. Sed eget ipsum vel arcu vehicula ullamcorper.',
          city: 'London, UK',
          venue: "Tower of London, St Katharine's & Wapping, London",
          hostedBy: 'Bob',
          hostPhotoURL: 'https://randomuser.me/api/portraits/men/20.jpg',
          attendees: [
            {
              id: 'a',
              name: 'Bob',
              photoURL: 'https://randomuser.me/api/portraits/men/20.jpg'
            },
            {
              id: 'b',
              name: 'Tom',
              photoURL: 'https://randomuser.me/api/portraits/men/22.jpg'
            }
          ]
        },
        {
          id: '2',
          title: 'Trip to Punch and Judy Pub',
          date: '2018-03-28T14:00:00',
          category: 'drinks',
          description:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus sollicitudin ligula eu leo tincidunt, quis scelerisque magna dapibus. Sed eget ipsum vel arcu vehicula ullamcorper.',
          city: 'London, UK',
          venue: 'Punch & Judy, Henrietta Street, London, UK',
          hostedBy: 'Tom',
          hostPhotoURL: 'https://randomuser.me/api/portraits/men/22.jpg',
          attendees: [
            {
              id: 'b',
              name: 'Tom',
              photoURL: 'https://randomuser.me/api/portraits/men/22.jpg'
            },
            {
              id: 'a',
              name: 'Bob',
              photoURL: 'https://randomuser.me/api/portraits/men/20.jpg'
            }
          ]
        },
        {
          id: '3',
          title: 'TeenHack',
          date: '2018-03-28T12:00:00',
          category: 'Programming',
          description:
            'Lorem ipsum dolor sit amet, consectetur adig elit. Phasellus sollicitudin ligula eu leo tincidunt, quis scelerisque magna dapibus. Sed eget ipsum vel arcu vehicula ullamcorper.',
          city: 'London, UK',
          venue: 'Punch & Judy, Henrietta Street, London, UK',
          hostedBy: 'Chikwado Okoye',
          hostPhotoURL: 'https://randomuser.me/api/portraits/men/29.jpg',
          attendees: [
            {
              id: 'b',
              name: 'Tom',
              photoURL: 'https://randomuser.me/api/portraits/men/23.jpg'
            },
            {
              id: 'a',
              name: 'Bob',
              photoURL: 'https://randomuser.me/api/portraits/men/24.jpg'
            }
          ]
        }
      ]
}


export default sampleData;