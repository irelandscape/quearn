# SteemQA
SteemQA is a Question and Answer application running on top of the Steem blockchain.

The application allows users with a Steem account to post questions related to approved topics and other Steem users to submit their answers.

Steem users can also submit comments to those questions and answers.

Like all Steem applications, SteemQA allows contributors to be rewarded in Steem cryptocurrency based on other Steem users upvoting their contributions.

General users (not logged in) can  browse through all content but cannot submit contributions.

## SteemQA Instances
While SteemQA is a generic application for submitting questions and answers for any topics, in practice each instance of the application can be bound to a domain area in order to keep it focused on a specific scope of interest.

For example, a first instance of SteemQA to be deployed is expected to be tight to **STEM**: Science, Technology, Engineering and Mathematics.

On the backend side, a tree of topics managed by the site administrator defines the scope of questions that can be submitted. For instance, the topics may look like this:
```console
science ->
        astronomy
        biology
        chemistry
        ...
technology ->
        telecommunications
        automotive
        computers
        ...
engineering ->
        electronics
        programming
        civilengeering
        ...
mathematics ->
        algebra
        calculus
        ...
```

## Link to other Steem applications
On the server side a SteemQA service scrapes the Steem blockchain for new questions and answers that have been submitted through other Steem applications, such as [Steemit](https://steemit.com) and [Busy](https://busy.org)

These questions and answers are searched based on the presence of specific tags.

Posts must have two tags present to be considered by SteemQA.
The first tag must be *steemqa*, the second tag must be the topic related to the question or answer.
For example:
```
steemqa programming
```

Furthermore, all question posts must have a title terminating with a question mark (?) character.
Answers must match the exact question title, preceded with a "A:" prefix.

Example of a question:
```
What is the Standard Model?
```
And all related answers must have the title:
```
A: What is the Standard Model?
```

## Supported client platforms
A SteemQA client-side application is provided for:
* Web browsers, accessible through a URL
* Android devices, provided as an Android app.
* iOS devices, provided as an iOS app.

## Roadmap
As the project is being developed during my limited spare time, no specific dates are listed in this section.
Nevertheless here is the intended objectives for future releases.


### Version 1.0
* General users (not logged in) can browse questions and answers.
* Users can log in with their Steem account using [Steemconnect](https://steemconnect.com/)
* All users can store their favourite topics (stored on the client side)
* Logged in users have their preferences saved on the server side so preferences will apply when accessing the SteemQA application on another device.
* Logged in users can post, edit and "delete" questions/answers.
* Logged in users can also comment on questions and answers.
* The SteemQA scrapper can extract new SteemQA questions, answers and comments from the Steem blockchain and store associated block numbers in the backend database. These contributions will then be available through all SteemQA clients.
* Home page shows top questions and answers
* Top unanswered questions are shown in priority in the app
* Questions are shown first as a card with a summary of the available information, such as title, image, author, upvotes and first few lines of content.
* Question cards, when clicked, expands into a full view of the question title and body followed by answers ordered by decreasing number of upvotes.
* Questions are searchable by keyword.
* Questions can be browsed by topic.
* Questions resulting from searching or browsing can be sorted by upvote number or chronological order.
