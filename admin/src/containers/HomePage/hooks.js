import { useEffect, useState, useRef } from 'react';
import axios from 'axios';

const useFetch = () => {
  const isMounted = useRef(true);
  const [state, setState] = useState({
    error: false,
    isLoading: true,
    posts: [{ link: '1' }, { link: '2' }],
  });

  useEffect(() => {
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();

    const fetchData = async () => {
      try {
        // const { data } = await axios.get(
        //   'https://strapi.io/api/blog-posts?_limit=2&_sort=publishedAt:desc',
        //   {
        //     cancelToken: source.token,
        //   }
        // );

        const data = [
          {
            "id": 266,
            "title": "Strapi’s User Roles and Permissions for Admin Panel",
            "slug": "strapi-s-user-roles-and-permissions-for-admin-panel",
            "publishedAt": "2021-05-12T12:30:00.000Z",
            "status": "published",
            "content": ">This article is a guest post by  [**Ukpai Ugochi**](https://twitter.com/hannydevelop). She wrote this blog post through the [Write for the Community](https://strapi.io/write-for-the-community) program.\n\n\nUser management in software development is an essential factor in cybersecurity. \n\nIn the wave of growing cybercrimes, how do you ensure Authorization and Authentication are done correctly? Improper Authorization and Authentication are the most reasons why your software is vulnerable. \n\nIf you care about your user's safety and [data compliance regulations](https://trint.com/resources/7n1weo10/what-is-data-compliance-and-why-is-it-so-important), securing and managing user access should be your utmost concern.\n\nThis is no different for an application built with [Strapi](https://strapi.io/). Security consciousness is an essential topic in software industries. For these reasons, Strapi allows you to manage the Authentication of End-users using Users and Permission Plugins and initiate Role-based Access Control (RBAC) for admin users in the admin panel.\n\n\n## Prerequisites\n\nYou need the following prerequisites to understand user management in Strapi.\n\n1. [Node.js](https://nodejs.org/en/download/) and Strapi installed in your working environment. A minimum of Node.js version 12.x is recommended.\n2. [Basic knowledge](https://strapi.io/documentation/developer-docs/latest/getting-started/introduction.html) of how Strapi works.\n\n\n## Goals\n\nThe goal of this article is to explain how user management works and how to implement user management. The target audience will understand how user management in Strapi is in accordance with data compliance regulations. \n\n\n## What you will learn\n\nThis article will briefly explore user management in Strapi, how user management for end-users and admin users works in Strapi, Local Authentication, and Providers’ use for End users Authentication with Strapi.\n\n## End Users Versus Admin Users\n\nAlthough Authentication and Authorization are both security processes in [Identity and Access Management (IAM)](https://www.coresecurity.com/blog/what-iam-security#:~:text=Identity%20and%20Access%20Management%20(IAM,access%20risks%20within%20a%20business)), they're different. While Authentication tries to identify users to make sure they're who they say they are, Authorization allows users to access specific resources/documents based on their Role (who they are).\n \nThink of Authentication as when you try to login into your Facebook account. If you don't provide the correct login credentials (email and password), you won't be allowed access to your account even though it's yours. \n\nYou'll only be allowed access to your account (authenticated) when you provide the correct login information. The system wants to be sure you're who you say you are.\n \nFor Authorization, think of owning a Facebook page. When you log in, since you own the Facebook page, you are an admin. Hence, you can post content on your page, modify content and even approve content from members of your page that are not administrators. \n\nWhen members of your group who are not administrators try to approve other people's content, they'll find out they can't. This is because they don't have the right to do that; only admins can.\n \nEnd users in Strapi are like users who login into their Facebook accounts. They're managed with the User and Permissions Plugin and are not admins. At the same time, admin users are like owners of a Facebook page. They're admins and are managed within the admin panel.\n\n## The Administration Panel Versus User and Permission Plugin\n\nWhile the User and Permissions Plugin offer user management just like the admin panel, it is essential to know that these two offer user management for different user types. The administration panel allows you to implement Role-based Access Control for users who have access to the admin panel. \n\nIn contrast, the User and Permissions Plugin will enable you to manage End-users and enforce Authentication.\n \nTo understand this better, let's look at an example of a small blogging company. This company has a ton of authors, editors, and a director of customer success. \n\nTo organize processes in this company, the authors need to access only their posts, while editors should have access to all posts they would be editing. The director of customer success should be able to access and manage all features concerning posts. \n\nHence, authors can be assigned to author role, editors to editor role, and director of customer success to super admin role in the administration panel.\n\n\n![](https://paper-attachments.dropbox.com/s_C4F7D8B5F91C649574F3AF1B0CFBBDCE34016A34AA641F41C316E26842584B87_1614336421535_strapi2.png)\n\n\nThe roles in the administration panel by default are `Author`, `Editor`, and `Super Admin`. By default, the user who creates the Strapi application is assigned the Super Admin role. You can edit any Role by clicking on the **edit** button beside each Role.\n \nHowever, user management in the User and Permissions Plugin is different. For example, you would want readers of articles in your blog to drop comments (feedback) after reading articles written by authors. To do this, they'll need to register an account. \n\nHere, you may need to set the User and Permissions Plugin to allow users, whether registered or not, to view articles in your blog. Nevertheless, you may not want unregistered (unauthenticated) users to comment unless they register.\n\n\n![](https://paper-attachments.dropbox.com/s_C4F7D8B5F91C649574F3AF1B0CFBBDCE34016A34AA641F41C316E26842584B87_1614336661885_strapi3.png)\n\n\nThe roles in the User and Permissions Plugin by default are the `Public` and `Authenticated` roles. By default, registered users are assigned to the `Authenticated` Role.\n\n## Adding A New User to The Administration Panel\n\nAs your blog keeps growing, you'll need to employ more authors and editors. Let's register a new user (author) for our blog in the admin panel.\n\nFirst, navigate to **Settings** in the navigation panel by the left. Click on **Users** under the **Administration Panel** section. You should see the image below.\n\n\n![](https://paper-attachments.dropbox.com/s_C4F7D8B5F91C649574F3AF1B0CFBBDCE34016A34AA641F41C316E26842584B87_1614337051778_strapi4.png)\n\n\nNext, click on the blue **Create New User** button. Fill in the user's details and user's roles. The user can be assigned to more than one Role. However, in this case, we are assigning the user to the **Author** role.\n\nAt this point, you will be asked to send a registration token to the user so that they can connect.\n\n\n![](https://paper-attachments.dropbox.com/s_C4F7D8B5F91C649574F3AF1B0CFBBDCE34016A34AA641F41C316E26842584B87_1614337101255_strapi5.png)\n\n\nSince our sample application is locally hosted, I'll copy the link and paste it into my browser. Next, I'll be directed to this page once the token registration loads.\n\n\n![](https://paper-attachments.dropbox.com/s_C4F7D8B5F91C649574F3AF1B0CFBBDCE34016A34AA641F41C316E26842584B87_1614337149740_strapi6.png)\n\n\nFill in the information required and click on the Let's Start button. Notice that the new user dashboard you just registered only has a media library to upload files. \n\nThe Super Admin can see files uploaded by any user. Also, notice that when you navigate to Settings/Administration panel/roles, i.e., [http://localhost:1337/admin/settings/roles](http://localhost:1337/admin/settings/roles%60), you now have one registered author.\n\n## User Management in the Administration Panel Explained\n\nThis section will create a sample blog with two authors, two editors, and one super admin. The goal of this sample blog is to understand how user management in the administration panel is done.\n\nLike in our last example on adding a new user to the admin panel, add one more author and two editors.\n\nNavigate to the tab where one of the authors is logged in and add a media. For me, I'll be adding a `Jpeg` file for one of my users. To do this, click on **Media Library** in the navigation tab. Next, click on the Upload assets button, and you'll be prompted to upload an asset.\n\n\n![](https://paper-attachments.dropbox.com/s_C4F7D8B5F91C649574F3AF1B0CFBBDCE34016A34AA641F41C316E26842584B87_1614337295048_strapi8.png)\n\n\n \nWhen you navigate to the tab where the super admin or editors are logged in and navigate to **plugins/media library**, i.e., `http://localhost:1337/admin/plugins/upload`, you should see the file you just uploaded. However, only the author who uploaded the file can see it; the other author can't assess it.\n\nJust like a conventional blog, editors can replace media posted by an author. When you customize roles in the admin panel, you can give permissions to editors to access only posts by authors assigned to them.\n\nAlso, you can create new `collection types` for your articles and assign roles to users that can assign them.\n\n## Updating and Adding New Roles in the Administration Panel.\n\nYou can update the permissions of each Role as well as add new roles. We have only three Roles by default. However, we can decide to add more Roles in the admin panel. \n\nFor example, in our sample blog application, we may require an editor in chief. He isn't limited to access only posts that he is assigned to edit, but he can access all Posts on the board.\n\nTo add a new role for our editor-in-chief:\n\n\n1. Navigate to **Settings/Administration Panel/Roles,** i.e., `[http://localhost:1337/admin/settings/roles](http://localhost:1337/admin/settings/roles%60)`.\n2. Click on the **Add new role** button.\n3. Fill in the required information, and the new Role you just created will be present in the admin panel.\n\nTo update an already existing role, click on the edit button beside the Role. Please search for the function you'll like to update and click on the box to check it.\n\n## Customizing Users Roles and Permissions in the Administration Panel.\n\nSometimes, when you create a new role, you may need to add some custom conditions. \n\nFor instance, let's imagine our blog has a premium feature that costs $5, and you want an accountant to have access only to premium customer's billing. When you create a new role named Accountant, the Accountant won't have access to the premium feature only by default.\n\nTo enable this, we can customize conditions by editing our `config/functions/bootstrap.js` file. For this example, this block of code does the magic.\n\n\n     module.exports = () => {\n     strapi.admin.services.permission.conditionProvider.register({\n     displayName: 'Premium Customers Only,\n     name: 'premium-customers-only',\n     plugin: 'admin',\n     handler: { amount: { $lt: 5 }},\n     });\n    };\n\nRestart your server and click on the edit button for the `Accountant` role. This new condition should now be in the `Accountant` role, and you can click on it to apply to all accountants.\n\n## User Management for End Users\n\nIn this section, we will explore the different states of an end-user. From Public Role to Authenticated Role, and how to manage permissions for end users.\n \n**Public Role**\nPublic Role is the default role associated with every request that doesn't have an authorization header. If you allow some permissions in this Role, everybody will be able to access the routes or endpoint you selected.\n\n**Authenticated role**\nEvery new user that logs in (authenticated) is given this Role by default if you don't provide a role for them at creation. In this Role, you can define routes that authenticated users can access.\n \n**Permission’s management**\nTo manage or modify permissions of user roles, click on the role name in the dashboard. This will enable you to view all functions related to a specific route available in your application. Check or uncheck a function name to permit the current Role you're editing.\n\nMost times, new users are not given roles. To update the default role and assign a new Role to the user, navigate to the `Advanced settings` tab and update the `Default role for authenticated users` option. Please search for the user and update their Role.\n\n## Local Authentication for End Users\n\nFor Strapi end users, authentication can either be done locally or with the use of providers. In this section, we will explore what local authentication in Strapi is. \n\nLocal authentication involves authentication locally on Strapi with your login credentials. Here, we will discuss how registration and authentication can be done locally on Strapi.\n\n**Registration**\nRegistration in Strapi's admin panel is pretty straightforward. When this plugin is installed, you can register users with [Axios](https://www.npmjs.com/package/axios) by posting their data into your database, as seen in the example below.\n\n\n    //import axios\n    import axios from 'axios';\n    \n    // Add your own code here to customize or restrict how the public can register new users.\n    \n    // make post request with user's credential\n    axios\n      .post('http://localhost:1337/auth/local/register', {\n        username: 'username',\n        email: 'email',\n        password: 'password',\n      })\n      .then(response => {\n        // If user was registered successfully .....\n        console.log('Well done!');\n        console.log('User profile', response.data.user);\n        console.log('User token', response.data.jwt);\n      })\n      .catch(error => {\n        // If there was an error .......\n        console.log('An error occurred:', error.response);\n      });\n\nRegistered users who login successfully have a default `authenticated` role.\n\n**Login**\nUser login is an authentication process. A post request with the user's credential is made to the database for authentication. When a user is successfully authenticated, it will respond with the user's information and an authentication token. \n\nUser login can also be done using [providers](https://oauth.net/2/) like GitHub, Google, Facebook, and so on.\n\nIn the code below, we will look into user login locally while providers will be discussed later. For local user login, the API request will look like this.\n\n\n    //import axios\n    import axios from 'axios';\n    \n    // make post request with user's credential\n    axios\n      .post('http://localhost:1337/auth/local', {\n        identifier: 'username or email',\n        password: 'password',\n      })\n      .then(response => {\n        // If user was registered successfully .....\n        console.log('Well done!');\n        console.log('User profile', response.data.user);\n        console.log('User token', response.data.jwt);\n      })\n      .catch(error => {\n        // If there was an error .......\n        console.log('An error occurred:', error.response);\n      });\n\nThe `identifier` in the API call can either be the user’s email or username.\n\n**Token Usage**\nWhen you want to limit which user can access some routes or documents based on their Role, you can use JWT tokens and place JSON web tokens in the authorization header of your API request for restricted permission requests.\n\nIf you don't place an authorization header in your API requests, then the request will assume the `public role` permission by default. Below is an example of an API request with an authorization header.\n\n\n    //import axios\n    import axios from 'axios';\n    \n    // place your token here or you can use a .env file.\n    const token = 'YOUR_TOKEN_HERE';\n    \n    // make post request.\n    axios\n      .get('http://localhost:1337/posts', {\n    // place authorization header here\n        headers: {\n          Authorization: `Bearer ${token}`,\n        },\n      })\n      .then(response => {\n        // If user was registered successfully .....\n        console.log('Data: ', response.data);\n      })\n      .catch(error => {\n        // If there was an error .......\n        console.log('An error occurred:', error.response);\n      });\n\nThe example above places an authorization header in the API request to retrieve posts. Remember that when a user is successfully authenticated, the user token will be sent as seen in our login example `console.log('User token', response.data.jwt);`.\n\nIf the user's token doesn't correspond to the token required during authorization, an error will occur, and error code `401 (unauthorized)` will be displayed. \n\n**Email Validation**\n\nTo avoid spamming, you may want to send an email to registered users to validate their registration. To do this, set `Enable email confirmation` to `ON` in the admin dashboard. Make sure that the [URL config](https://strapi.io/documentation/developer-docs/latest/setup-deployment-guides/configurations.html#server) property is set so that users can receive the confirmation link. \n\nSometimes, there's a need to re-send confirmation mail to users. To do this, make a Request like the example below.\n\n\n    // import axios\n    import axios from 'axios';\n    \n    // Send validation email\n    axios\n      .post(`http://localhost:1337/auth/send-email-confirmation`, {\n        email: 'user@strapi.io', // user's email\n      })\n      .then(response => {\n        // If user was registered successfully .....\n        console.log('Your user received an email');\n      })\n      .catch(error => {\n      // If there was an error .......\n        console.error('An error occurred:', error.response);\n      });\n\n\n## The Use of Providers For End Users Authentication\n\nFor most users, it becomes more stressful to create new profiles for each software they're about to use. To solve this issue, Strapi allows users to sign in with the help of providers. For instance, you can be able to sign in to your Strapi account with GitHub. \n\nYou can implement this feature with your application built with Strapi so that your users can use providers like Facebook or Google to log into their application.\n\n\n![Strapi and Provider Authentication Flow](https://paper-attachments.dropbox.com/s_0873AB05CC983F668DCA920B2CBE7FD08CBFF999F37C51D1EC5186AAC30EF736_1614220034462_forstrapi.png)\n\n\nThe diagram above explains how providers communicate with your application whenever a user logs in or registers with them. It is important to note that users who log into their accounts have the `authenticated` Role assigned to them by default if you haven't assigned a role to them yet, regardless of whether they use providers or the local method. \n\nStrapi allows users to log in or register with the following providers:\n\n- GitHub\n- Facebook\n- Google\n- AWS Cognito\n- Twitter\n- Discord\n- Twitch\n- Instagram\n- VK\n- Linkedin\n- Reddit\n- Auth0\n\nA detailed explanation of how to incorporate each provider in your application is shown in this [documentation](https://strapi.io/documentation/developer-docs/latest/development/plugins/users-permissions.html#concept).\n\n## Conclusion\n\nThis article explains how user management in Strapi is done. We have explored role-based access control and how it relates to the administration panel. Also, we discussed authentication using the user and permission plugin both locally and with the use of providers.\n \nFirst, we discussed the distinct difference between user management in the user and permissions plugin and the administration panel.\n\nNext, we set up a simple blog to explain user roles and permissions in the administration panel. We also looked into customizing the Roles in the admin panel.\n \nThe usefulness of user management cannot be overemphasized. It is essential to understand how this works to optimize your application better. To have access to unlimited roles in the admin panel, try out [Strapi's enterprise edition](https://strapi.io/pricing).\n\n",
            "user": {
              "id": 43,
              "username": "Ukpai Ugochi",
              "email": "ukpaiugochi0@gmail.com",
              "provider": "local",
              "confirmed": true,
              "blocked": false,
              "role": 2,
              "created_at": "2021-02-16T09:27:06.602Z",
              "updated_at": "2021-02-16T09:27:06.674Z",
              "avatar": {
                "id": 1571,
                "alt": null,
                "lottieAnimation": null,
                "media": {
                  "id": 1861,
                  "name": "screenshot_20210129-195504.png",
                  "alternativeText": "",
                  "caption": "",
                  "width": 414,
                  "height": 511,
                  "formats": {
                    "small": {
                      "ext": ".png",
                      "url": "/uploads/small_screenshot_20210129_195504_695ada1268.png",
                      "hash": "small_screenshot_20210129_195504_695ada1268",
                      "mime": "image/png",
                      "name": "small_screenshot_20210129-195504.png",
                      "path": null,
                      "size": 367.59,
                      "width": 405,
                      "height": 500
                    },
                    "thumbnail": {
                      "ext": ".png",
                      "url": "/uploads/thumbnail_screenshot_20210129_195504_695ada1268.png",
                      "hash": "thumbnail_screenshot_20210129_195504_695ada1268",
                      "mime": "image/png",
                      "name": "thumbnail_screenshot_20210129-195504.png",
                      "path": null,
                      "size": 46.8,
                      "width": 126,
                      "height": 156
                    }
                  },
                  "hash": "screenshot_20210129_195504_695ada1268",
                  "ext": ".png",
                  "mime": "image/png",
                  "size": 330.47,
                  "url": "/uploads/screenshot_20210129_195504_695ada1268.png",
                  "previewUrl": null,
                  "provider": "local",
                  "provider_metadata": null,
                  "created_at": "2021-02-15T18:14:57.095Z",
                  "updated_at": "2021-02-15T18:14:57.118Z"
                }
              }
            },
            "created_at": "2021-05-10T16:23:27.325Z",
            "updated_at": "2021-05-12T14:49:22.698Z",
            "published_at": "2021-05-12T14:47:47.439Z",
            "settings": null,
            "seo": {
              "id": 505,
              "metaTitle": "Strapi’s User Roles and Permissions for Admin Panel",
              "metaDescription": "User management in software development is an essential factor in cybersecurity. Learn how to ensure Authorization and Authentication are done correctly.",
              "preventIndexing": false,
              "shareImage": {
                "id": 1956,
                "alt": "Strapi’s User Roles and Permissions for Admin Panel",
                "lottieAnimation": null,
                "media": {
                  "id": 2151,
                  "name": "Ukpai Ugochi-2.jpg",
                  "alternativeText": "",
                  "caption": "",
                  "width": 2048,
                  "height": 1024,
                  "formats": {
                    "large": {
                      "ext": ".jpg",
                      "url": "/uploads/large_Ukpai_Ugochi_2_9292907a2e.jpg",
                      "hash": "large_Ukpai_Ugochi_2_9292907a2e",
                      "mime": "image/jpeg",
                      "name": "large_Ukpai Ugochi-2.jpg",
                      "path": null,
                      "size": 37.29,
                      "width": 1000,
                      "height": 500
                    },
                    "small": {
                      "ext": ".jpg",
                      "url": "/uploads/small_Ukpai_Ugochi_2_9292907a2e.jpg",
                      "hash": "small_Ukpai_Ugochi_2_9292907a2e",
                      "mime": "image/jpeg",
                      "name": "small_Ukpai Ugochi-2.jpg",
                      "path": null,
                      "size": 13.72,
                      "width": 500,
                      "height": 250
                    },
                    "medium": {
                      "ext": ".jpg",
                      "url": "/uploads/medium_Ukpai_Ugochi_2_9292907a2e.jpg",
                      "hash": "medium_Ukpai_Ugochi_2_9292907a2e",
                      "mime": "image/jpeg",
                      "name": "medium_Ukpai Ugochi-2.jpg",
                      "path": null,
                      "size": 24.66,
                      "width": 750,
                      "height": 375
                    },
                    "thumbnail": {
                      "ext": ".jpg",
                      "url": "/uploads/thumbnail_Ukpai_Ugochi_2_9292907a2e.jpg",
                      "hash": "thumbnail_Ukpai_Ugochi_2_9292907a2e",
                      "mime": "image/jpeg",
                      "name": "thumbnail_Ukpai Ugochi-2.jpg",
                      "path": null,
                      "size": 5.06,
                      "width": 245,
                      "height": 122
                    }
                  },
                  "hash": "Ukpai_Ugochi_2_9292907a2e",
                  "ext": ".jpg",
                  "mime": "image/jpeg",
                  "size": 93.2,
                  "url": "/uploads/Ukpai_Ugochi_2_9292907a2e.jpg",
                  "previewUrl": null,
                  "provider": "local",
                  "provider_metadata": null,
                  "created_at": "2021-05-12T14:47:28.514Z",
                  "updated_at": "2021-05-12T14:47:28.537Z"
                }
              }
            },
            "image": {
              "id": 1958,
              "alt": "Strapi’s User Roles and Permissions for Admin Panel",
              "lottieAnimation": null,
              "media": {
                "id": 2150,
                "name": "Strapi Custom Plugin-8.jpg",
                "alternativeText": "",
                "caption": "",
                "width": 966,
                "height": 571,
                "formats": {
                  "small": {
                    "ext": ".jpg",
                    "url": "/uploads/small_Strapi_Custom_Plugin_8_92fd247ab9.jpg",
                    "hash": "small_Strapi_Custom_Plugin_8_92fd247ab9",
                    "mime": "image/jpeg",
                    "name": "small_Strapi Custom Plugin-8.jpg",
                    "path": null,
                    "size": 11.39,
                    "width": 500,
                    "height": 296
                  },
                  "medium": {
                    "ext": ".jpg",
                    "url": "/uploads/medium_Strapi_Custom_Plugin_8_92fd247ab9.jpg",
                    "hash": "medium_Strapi_Custom_Plugin_8_92fd247ab9",
                    "mime": "image/jpeg",
                    "name": "medium_Strapi Custom Plugin-8.jpg",
                    "path": null,
                    "size": 20.32,
                    "width": 750,
                    "height": 443
                  },
                  "thumbnail": {
                    "ext": ".jpg",
                    "url": "/uploads/thumbnail_Strapi_Custom_Plugin_8_92fd247ab9.jpg",
                    "hash": "thumbnail_Strapi_Custom_Plugin_8_92fd247ab9",
                    "mime": "image/jpeg",
                    "name": "thumbnail_Strapi Custom Plugin-8.jpg",
                    "path": null,
                    "size": 4.39,
                    "width": 245,
                    "height": 145
                  }
                },
                "hash": "Strapi_Custom_Plugin_8_92fd247ab9",
                "ext": ".jpg",
                "mime": "image/jpeg",
                "size": 29.39,
                "url": "/uploads/Strapi_Custom_Plugin_8_92fd247ab9.jpg",
                "previewUrl": null,
                "provider": "local",
                "provider_metadata": null,
                "created_at": "2021-05-12T14:46:12.275Z",
                "updated_at": "2021-05-12T14:46:12.305Z"
              }
            },
            "slices": [],
            "postCategories": [
              {
                "id": 13,
                "name": "Guides & Tutorials",
                "created_at": "2020-09-09T13:29:35.969Z",
                "updated_at": "2020-09-09T13:29:35.969Z"
              }
            ]
          },
          {
            "id": 265,
            "title": "The State and Future of Frontend Development in 2021",
            "slug": "the-state-and-future-of-frontend-development-in-2021",
            "publishedAt": "2021-05-10T15:00:00.000Z",
            "status": "published",
            "content": "> This article is a guest post by Piero Borrelli. He wrote this blog post through the Write for the Community program. If you are passionate about everything Jamstack, open-source, or javascript and want to share, [join the writer's guild](/write-for-the-community)!\n\nNew technologies arise every day, and the necessity for relevant tools to support complex web applications is now more vital than ever.\n\nIn a sea of information, it's hard to understand where frontend development will go in 2021, and that's why I wrote this article, to hand you from what 2020 was for developing web applications to what the future could look like in one year from now. \n\nPlease note: while I enjoy giving my opinion, I appreciate even more citing extremely reliable information. So in this article, combined with my thoughts, you will find accurate survey data from websites like [Stack Overflow Survey](https://insights.stackoverflow.com/survey/2020#technology-most-loved-dreaded-and-wanted-web-frameworks-loved2) and the [State of Frontend](https://tsh.io/state-of-frontend/#developers).\n\n\n## Frameworks\n\nIn the world of frontend frameworks, one thing was true in 2020 and will still be true this year: React is dominating.\n\n\n![Source Stack Overflow developers’ survey](https://paper-attachments.dropbox.com/s_59624AE4817D42B6108050909519570C58EF3A0C5D2B3F4742B8F2C7B3C91CEB_1618216697795_image.png)\n\n\nReact has seen its usage skyrocket in the last few years compared to other traditional frameworks like Angular or Vue. I've seen quite a loss of interest in Angular in the previous year and a steady increase in Vue usage.\n\nThis dominance by React is probably also given by the latest version of Angular and Vue being so delayed and awaited by the community.\n\nHowever, React's hegemony doesn't mean it will be untouched in 2021, as we see many new exciting frameworks pop up. \n\nExamples of these frameworks include:\n\n\n## Svelte:\n\nA framework to provide reactivity over typical DOM structures and efficient compilation.\n\n\n## Stencil:\n\nA toolchain for building reusable, scalable Design Systems using web components.\n\nSo one thing is sure for this year, React will still be the most loved and used frontend framework. Still, many new contestants are coming. So we might see some exciting increase in usage for tools like Svelte or Stencil.\n\n\n## TypeScript\n\nDespite all the differences that frontend frameworks provide, one technology is uniting them all: TypeScript. This superset of JavaScript allows you to build more readable, clear, and maintainable code. \n\nI use TypeScript myself in my professional environment. Now, in 2021, it feels like the standard choice for complex web applications more than ever. It's just something that you have to use to make your coding process smooth. \n\nIt's no surprise that [all the frameworks](https://masteringbackend.com/posts/top-5-typescript-frameworks) are now improving their support for TypeScript, from React and Angular to modern ones like the mentioned [Svelte](https://svelte.dev/blog/svelte-and-typescript) and [Stencil](https://stenciljs.com/docs/typed-components).\n\nIt is also not unexpected that developers from all over the world elected TypeScript as the second most loved language in 2020. \n\n\n![Source: Stack Overflow developers 2020 survey](https://paper-attachments.dropbox.com/s_59624AE4817D42B6108050909519570C58EF3A0C5D2B3F4742B8F2C7B3C91CEB_1618216762923_image.png)\n\n\nSo my prediction for this tool is easy. TypeScript will become even more used this year. It will be more and more recognized as the must-have tool when developing large web applications.\n\n\n## The Rise of Jamstack\n\nThe word Jamstack stands for JavaScript, markup, and APIs. I've seen the rise of Jamstack websites relatively stable throughout 2020. Every day, a new article or video about this technology would pop up. \n\nThe advantage of this software architecture is that it allows you to build more performant and cheaper web applications.\n\nWith this web structure, instead of rendering a page on every request, you pre-render it before request time (Static Generation). This mechanism provides your web app for optimal performance and overall higher availability.\n\nFrom the [state of frontend survey](https://tsh.io/state-of-frontend/#frameworks), you can also gather some interesting information about the usage of the Jamstack in the last year and the increasing number of professionals adopting it.\n\nWhen it comes to this emerging stack, the most used static generators technology are Gatsby, Next.js, and Nuxt.js.\n\n\n![Source: State of frontend survey](https://paper-attachments.dropbox.com/s_59624AE4817D42B6108050909519570C58EF3A0C5D2B3F4742B8F2C7B3C91CEB_1618216807197_image.png)\n\n\nMy prediction for 2021 is that the Jamstack will increase in popularity, with new developers adopting it and pushing the boundaries of what can be done with this architecture. \n\nIn that sense, I also feel pretty confident that Gatsby and Next.js will continue their reign in 2021, as both of them won't probably see any big competitors popping this year.\n\n\n## Testing\n\nWith always increasingly complex web applications, testing has become a crucial part of our developers' workflow. The success of the products we develop primarily depends on how efficient and reliable it is, so that's the direction we have to focus our efforts. \n\nWhen it comes to Testing tools and libraries, Jest continues its reign, thanks to React's popularity and its connection with this tool.\n\nOther testing libraries include Mocha and Jasmine. The first one is still a good choice despite its setup complexity and Jasmine's rapid decline as Angular is its default testing tool.\n\nWhen it comes to the workflow for testing, I wasn't surprised to see how a combination of software developers + QA specialists is still the most used for testing a web application, as it emerges from this survey. \n\nI believe that the practice of testing our web apps will increase over time this year, as in 2021, testing and modern frontend development have been recognized as two deeply linked and inseparable topics.\n\n\n![Source: State of frontend survey](https://paper-attachments.dropbox.com/s_59624AE4817D42B6108050909519570C58EF3A0C5D2B3F4742B8F2C7B3C91CEB_1618216854158_image.png)\n\n\n\n\n## The Role of Headless CMS\n\nA headless CMS is a content management system that allows you to deliver content to multiple frontends. With a CMS, your application frontend won't be coupled to a single backend. Instead, you will have the power to deliver your data to as many frontends as you want.\n\nThis technology has gained a lot of momentum over the last years, and some of the world's largest companies are now adopting it.\n\nThis condition found its roots in the advantages that a headless CMS brings in, including:\n\n\n- **Omnichannel publishing**: Meaning the ability to serve data to multiple channels, a crucial practice for companies that want to diversify their product's offer.\n\n\n- **Ease of use**: Once you master how to use a headless CMS, the time used to develop new features will be less significant, improving your team workflow. \n\n\n- **Flexibility for developers**: A headless CMS provides freedom to developers, as you don't have a fixed structure for your coding. You can pick and adapt your language of choice at any time.\n\nThe introduction and adoption of headless CMS systems have been a great discovery for me. This type of solution is not suitable for every company. Still, it can be a perfect solution in the exemplary scenario, so I can see that this technology will increase in popularity more and more in 2021, with some possible cool integrations with the Jamstack.\n\n\n## Changes I Would Like to See\n\nAs a React developer, I'm pretty happy to see the excellent tool's results over time. In 2021, I would love to see a stronger inclination toward using hooks and the context API for managing state, with an evolution in that sense that could distance the framework from the classic Redux. \n\nAs my advice, here is what I think you should seriously consider watching our for this year in the world of frontend:\n\n\n- **Start adopting TypeScript**: I'm convinced this tool will increase in popularity. Independent of which framework you're using, developing large-scale applications will have to go through this technology.\n\n\n- **Consider learning React:** It will evolve, but it's here to stay. So when it comes to improving your frontend skills and making yourself more marketable, this framework should be the way to go.\n\n\n- **Keep an eye on static site generators**: tools like Gatsby and Next.js will be part of a frontend development movement that wants to make web apps faster.\n\n\n- **Reinforce your testing skills**: adopting one of the most common tools we've seen here, like Jest or Mocha.\n\n\n- **Consider using a headless CMS in your team**: depending on your company's goals, a headless CMS could be the way to go if you want \n\n\n\n## Conclusion\n\nThe frontend world is constantly changing, and web developers have to keep up with it because that's a crucial part of our job. Unfortunately, the web is so full of information that it's often hard to understand where to direct your efforts and focus. \n\nWith this article, I've given you an overview of what the future of Frontend development will probably look like this year, hopefully helping you understand what topics you should watch out for and how your career could evolve during 2021.",
            "user": {
              "id": 52,
              "username": "Piero Borrelli",
              "email": "pieroborrellidev@gmail.com",
              "provider": "local",
              "confirmed": false,
              "blocked": false,
              "role": 1,
              "created_at": "2021-05-10T11:42:17.119Z",
              "updated_at": "2021-05-10T15:07:24.964Z",
              "avatar": {
                "id": 1955,
                "alt": "Piero Borrelli",
                "lottieAnimation": null,
                "media": {
                  "id": 2148,
                  "name": "profile.jpeg",
                  "alternativeText": "",
                  "caption": "",
                  "width": 131,
                  "height": 130,
                  "formats": null,
                  "hash": "profile_445079afdf",
                  "ext": ".jpeg",
                  "mime": "image/jpeg",
                  "size": 2.87,
                  "url": "/uploads/profile_445079afdf.jpeg",
                  "previewUrl": null,
                  "provider": "local",
                  "provider_metadata": null,
                  "created_at": "2021-05-10T15:07:20.783Z",
                  "updated_at": "2021-05-10T15:07:20.806Z"
                }
              }
            },
            "created_at": "2021-05-10T11:10:19.987Z",
            "updated_at": "2021-05-10T15:15:44.845Z",
            "published_at": "2021-05-10T15:14:42.578Z",
            "settings": {
              "id": 220,
              "theme": "light",
              "blank": false,
              "chatbot": null,
              "microdata": null,
              "sponsoredScript": false,
              "logo": null,
              "chargebee": null
            },
            "seo": {
              "id": 504,
              "metaTitle": "The State and Future of Frontend Development in 2021",
              "metaDescription": "Here's a review of what 2020 was for developing web applications and what the future could look like in one year from now to understand where frontend development will go in 2021.",
              "preventIndexing": false,
              "shareImage": {
                "id": 1953,
                "alt": "The State and Future of Frontend Development in 2021",
                "lottieAnimation": null,
                "media": {
                  "id": 2149,
                  "name": "Anumadu Moses-4.jpg",
                  "alternativeText": "",
                  "caption": "",
                  "width": 2048,
                  "height": 1028,
                  "formats": {
                    "large": {
                      "ext": ".jpg",
                      "url": "/uploads/large_Anumadu_Moses_4_1cf6585302.jpg",
                      "hash": "large_Anumadu_Moses_4_1cf6585302",
                      "mime": "image/jpeg",
                      "name": "large_Anumadu Moses-4.jpg",
                      "path": null,
                      "size": 36.59,
                      "width": 1000,
                      "height": 502
                    },
                    "small": {
                      "ext": ".jpg",
                      "url": "/uploads/small_Anumadu_Moses_4_1cf6585302.jpg",
                      "hash": "small_Anumadu_Moses_4_1cf6585302",
                      "mime": "image/jpeg",
                      "name": "small_Anumadu Moses-4.jpg",
                      "path": null,
                      "size": 13.7,
                      "width": 500,
                      "height": 251
                    },
                    "medium": {
                      "ext": ".jpg",
                      "url": "/uploads/medium_Anumadu_Moses_4_1cf6585302.jpg",
                      "hash": "medium_Anumadu_Moses_4_1cf6585302",
                      "mime": "image/jpeg",
                      "name": "medium_Anumadu Moses-4.jpg",
                      "path": null,
                      "size": 25.19,
                      "width": 750,
                      "height": 376
                    },
                    "thumbnail": {
                      "ext": ".jpg",
                      "url": "/uploads/thumbnail_Anumadu_Moses_4_1cf6585302.jpg",
                      "hash": "thumbnail_Anumadu_Moses_4_1cf6585302",
                      "mime": "image/jpeg",
                      "name": "thumbnail_Anumadu Moses-4.jpg",
                      "path": null,
                      "size": 5.26,
                      "width": 245,
                      "height": 123
                    }
                  },
                  "hash": "Anumadu_Moses_4_1cf6585302",
                  "ext": ".jpg",
                  "mime": "image/jpeg",
                  "size": 93.28,
                  "url": "/uploads/Anumadu_Moses_4_1cf6585302.jpg",
                  "previewUrl": null,
                  "provider": "local",
                  "provider_metadata": null,
                  "created_at": "2021-05-10T15:12:42.519Z",
                  "updated_at": "2021-05-10T15:12:42.541Z"
                }
              }
            },
            "image": {
              "id": 1954,
              "alt": "The State and Future of Frontend Development in 2021",
              "lottieAnimation": null,
              "media": {
                "id": 2147,
                "name": "Strapi Custom Plugin-7.jpg",
                "alternativeText": "",
                "caption": "",
                "width": 966,
                "height": 571,
                "formats": {
                  "small": {
                    "ext": ".jpg",
                    "url": "/uploads/small_Strapi_Custom_Plugin_7_8d40c54791.jpg",
                    "hash": "small_Strapi_Custom_Plugin_7_8d40c54791",
                    "mime": "image/jpeg",
                    "name": "small_Strapi Custom Plugin-7.jpg",
                    "path": null,
                    "size": 12.36,
                    "width": 500,
                    "height": 296
                  },
                  "medium": {
                    "ext": ".jpg",
                    "url": "/uploads/medium_Strapi_Custom_Plugin_7_8d40c54791.jpg",
                    "hash": "medium_Strapi_Custom_Plugin_7_8d40c54791",
                    "mime": "image/jpeg",
                    "name": "medium_Strapi Custom Plugin-7.jpg",
                    "path": null,
                    "size": 21.96,
                    "width": 750,
                    "height": 443
                  },
                  "thumbnail": {
                    "ext": ".jpg",
                    "url": "/uploads/thumbnail_Strapi_Custom_Plugin_7_8d40c54791.jpg",
                    "hash": "thumbnail_Strapi_Custom_Plugin_7_8d40c54791",
                    "mime": "image/jpeg",
                    "name": "thumbnail_Strapi Custom Plugin-7.jpg",
                    "path": null,
                    "size": 4.61,
                    "width": 245,
                    "height": 145
                  }
                },
                "hash": "Strapi_Custom_Plugin_7_8d40c54791",
                "ext": ".jpg",
                "mime": "image/jpeg",
                "size": 31.48,
                "url": "/uploads/Strapi_Custom_Plugin_7_8d40c54791.jpg",
                "previewUrl": null,
                "provider": "local",
                "provider_metadata": null,
                "created_at": "2021-05-10T11:19:06.744Z",
                "updated_at": "2021-05-10T11:19:06.767Z"
              }
            },
            "slices": [
              {
                "__component": "slices.related-blog-posts",
                "id": 133,
                "gradientHeader": null,
                "intro": {
                  "id": 573,
                  "theme": "purple",
                  "label": null,
                  "title": "You might also be interested in...",
                  "text": null,
                  "button": [],
                  "smallTextWithLink": []
                },
                "blogPosts": [
                  {
                    "id": 56,
                    "title": "The Promise of JAMStack",
                    "slug": "jamstack",
                    "publishedAt": "2019-03-28T10:33:40.000Z",
                    "status": "published",
                    "content": "JAM stands for JavaScript, API, Markup. It illustrates a trend in creating web applications that have specific features.\nA more recent article about the Jamstack has been published: [Jamstack in 2021](https://strapi.io/blog/jamstack-in-2021)\n\n[Pedro Duarte](https://twitter.com/peduarte), author of the excellent website [JAMstack.wtf](https://jamstack.wtf/) forwards the following promise about the JAMStack:\n\n>“JAMstack is revolutionising the way we think about workflow by providing a simpler developer experience, better performance, lower cost and greater scalability.”\n\nMr. Duarte continues by providing a guide that, “[...] will help you understand why it exists and how to get started.”\n\nHe provides context, examples and resources in this guide built with Gatsby, hosted on Netlify and open sourced on Github. This idea is to gather the concept of JAMstack in a straight-forward guide to encourage other developers to adopt the workflow.\n\nI totally recommend anyone interested in a better understanding and getting started with JAMStack to include it in their journey forward. Here is a curation we made on the subject from different sources.\n\n###### Table of Contents:\n[What is the JAMstack?](#what)<br>\n[Back to ~~basics~~ static](#basics)<br>\n[So how to get started?](#how)<br>\n[List of curated resources](#list)<br>\n[Example with Strapi](#example)\n\n## <a name=\"what\"></a>What is the JAMstack?\n\nAccording to the community website [JAMstack.org](https://www.jamstack.org), the JAMstack can be defined as a *Modern web development architecture based on client-side JavaScript, reusable APIs, and prebuilt Markup.* \n\n3 criteria define if your project follows this paradigm shift:\n\n- **JavaScript** should be managing any dynamic programming on the client side, through plain Javascript, frontend frameworks or librairies.\n- **API** : on a server side, the processes and database actions must be made available through APIs, requested with Javascript over HTTPS. The APIs can be created using third-party services like Strapi or be custom-built.\n- **Markup** : the html templates should be prebuilt at deployment time using a static site generator for example.\n\n## <a name=\"basics\"></a>Back to ~~basics~~ static\n\nJAMstack is not only simplifying the workflow for developers but also has many benefits. \n\n- **Ultra Speedy Performance** : \nBecause the static pages are prebuilt and served to your browser via a CDN, the time to first byte is minimised. Lots of functionalities that were usually processed in the back-end, are now managed on your browser side. \n- **Higher security** : Stop worrying about database or server-side vulnerabilities. You have no need for a server-side language to be executed, so less ways to inject code or get attacked.\n- **Easier scalability**: Because your files are served through CDN, when your app gets more requests, the CDN easily compensates for higher traffic.\n\nAnd last but not least, because the stack is Javascript-based, focused on the front-end, your frontend developers are not tied to a monolithic architecture, resulting in a **better developer experience** and a happier team. And who wouldn't want to have a happier team?\n\n![happy](/uploads/hermes-rivera.png_5c27f77be6.png)\n*Kudos to Hermes Rivera on Unsplash for this photo.*\n\n## <a name=\"how\"></a>So how to get started?\n\nMathieu Dionne (@MathDy24) gives great advice on this [Snipcart article](https://https://snipcart.com/blog/jamstack).\n\n###### A jungle of modern frontend tools to build your site\n\nAs a frontend developer, you need to know your Javascript and know of how to make use of APIs. Then you have to choose the frontend technology you feel like using.\n\nYou can use Javascript frontend frameworks like [React](https://reactjs.org), [Vue](https://vuejs.org/) or [Angular](https://angular.io/). Most of them don't technically output static HTML files, but it's possible to do so with experience or by using **static site generators** developed on top of them.\n\nIn short, static site generators takes source files and generates an entirely static website, ready to be delivered to viewers. \n\nThere is many options available to choose from and it might be difficult to see through the plethora of static site generators available, as all are more or less relevant depending on your use case.\n\nAmong them, [Gatsby](https://www.gatsbyjs.org/) is a Progressive Web App generator built on React that loads only the critical HTML, CSS, data, and JavaScript so your site loads as fast as possible. \n\n[Next.js](https://nextjs.org/) is a lightweight framework for static and server-rendered React applications, also built on React.\n\n[Nuxt.js](https://nuxtjs.org) is a framework for creating Vue.js applications, you can choose between Universal, Static Generated or Single Page application. Technically not exactly a SSG, you can still use the provided deployment option called *nuxt generate* tobuild a statically generated Vue.js Application.\n\n[Gridsome](https://gridsome.org) is a Vue.js-powered, modern site generator for building the fastest possible websites for any Headless CMS, APIs or Markdown-files.\n\nThere is many others, like [Hugo](https://gohugo.io/) or [Jekyll](https://jekyllrb.com/), you can have a look [here](https://snipcart.com/blog/choose-best-static-site-generator) or [here](https://medium.com/codingthesmartway-com-blog/top-static-site-generators-for-2019-26a4c8afcc05) to have an idea of which solution would best suit your needs.\n\n\n###### Headless CMS for backend functionalities\n\n\nYou may need your content to be edited and maintained after the website is built. This task will probably be someone non-technical's job and to ease their job, you might want to use a headless CMS.\n\nMany headless CMSs are available on the market today to do what they do best: manage content! You can find a list [here](https://www.headlessCMS.org).\n\n[Strapi](https://strapi./io)'s specificity is to be [open-source](https://github.com/strapi/strapi), based on NodeJS and designed by developers for the usage of frond-end developers. [Check us out](https://strapi.io/documentation/3.x.x/getting-started/quick-start.html) :-) \n\n###### Deployment\n\nNow that your app is built, it has to live somewhere. The good news is that the platforms for hosting static sites are cheap and some of are even free. You can find a list [here](https://www.thenewdynamic.org/tools/hosting-deployment/).\n\nWe did a tutorial for [Heroku](https://blog.strapi.io/deploying-a-strapi-api-on-heroku/) and [Ken Berkeley](https://github.com/kenberkeley) did an awesome job explaining his workflow for [AWS](https://github.com/61FINTECH/deploy-strapi-on-aws).\n\n## <a name=\"list\"></a>List of curated resources\n\n###### About JAMstack\n\n- [JAMstack.org](https://jamstack.org/)\n- [JAMstack.wtf](https://jamstack.wtf/)\n- [New to JAMstack? Everything You Need to Know to Get Started\n](https://snipcart.com/blog/jamstack)\n- [WTF is JAMStack?](https://cobwwweb.com/wtf-is-jamstack)\n\n###### Services\n- [Static Site Generators Lists](https://staticgen.com)\n- [Headless CMSs](https://headlessCMS.org)\n- [Third Parties services for static sites](§https://github.com/agarrharr/awesome-static-website-services)\n\n###### Communities\n- [JAMstack on LinkedIn](https://www.linkedin.com/groups/8722827/)\n- [JAMstack on reddit](https://www.reddit.com/r/JAMstack_dev/)\n\n## <a name=\"example\"></a>Example: using Strapi to deliver static content\n\nIn the following example made with the JAMstack, we are using Strapi to deliver the content through its API.\n\n###### Javascript\n\nThe Javascript code will allow to request data from the Strapi API:\n\n<iframe src=\"https://codesandbox.io/embed/my2p746p9?fontsize=12&module=%2Fsrc%2FListPage.js&view=editor\" title=\"strapi/jamstack\" style=\"width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;\" sandbox=\"allow-modals allow-forms allow-popups allow-scripts allow-same-origin\"></iframe>\n\n###### Front-end\n\nBelow, you can see the content requested:\n\n<iframe src=\"https://codesandbox.io/embed/my2p746p9?fontsize=12&hidenavigation=1&view=preview\" title=\"strapi/jamstack\" style=\"width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;\" sandbox=\"allow-modals allow-forms allow-popups allow-scripts allow-same-origin\"></iframe>\n\n----\nDid you like this article? Do you think it's missing something? Feel free to comment and start a discussion below. By the way, we are looking for developers with a taste for writing killer content for guest posting so if this rings a bell for you, feel free to [reach out](https://strapi.io/contact)!",
                    "user": 1,
                    "created_at": "2020-04-28T19:09:55.458Z",
                    "updated_at": "2021-03-18T10:14:52.754Z",
                    "published_at": "2020-04-28T19:09:55.458Z"
                  },
                  {
                    "id": 207,
                    "title": "Jamstack in 2021",
                    "slug": "jamstack-in-2021",
                    "publishedAt": "2021-01-11T11:00:00.000Z",
                    "status": "published",
                    "content": "## The Jamstack in 2021\n\nIf you are a software Developer in 2021, you probably should have heard of the Jamstack and might be wondering what this new architectural approach is all about. The Jamstack is one of the rapidly expanding software architectures in the world today and has experienced a massive increase in popularity and usage over the years.\n\nIn this article, we will talk about the Jamstack and the benefits of using the Jamstack. There is also a guide to help you get started with developing with the Jamstack in 2021 and links to popular Jamstack communities and resources to aid your learning.\n\n## What is the Jamstack\n\n\"A modern web development architecture based on client-side JavaScript, reusable APIs, and prebuilt Markup\"\n— Mathias Biilmann (CEO & Co-founder of Netlify).\n\nThe Jamstack, a term coined by **Mathias Biilmann** (CEO and Co-founder of Netlify), which stands for Javascript, APIs, and Markup, is a modern software architecture that is used for creating fast and secure websites and apps. \n\nThe Jamstack architecture consists of 3 core components:\n\n**Javascript** - for handling all your website's dynamic functionalities, like API request and response calls. Javascript in the Jamstack can take on many forms and are mostly found on the client-side. Examples are frontend frameworks like [React](https://reactjs.org/), [Angular](https://angularjs.org/), etc. \n\n**APIs** - Server-side functions and database commands are implemented with an API. The APIs are accessed by the front end with Javascript driven HTTP calls. \nAn API based headless CMS like [Strapi](/features) can also be used to manage your content and present it to your frontend with an API. You can also consume data from different external sources with an API, this reduces complexity by eliminating the need for a backend.\n\n**Markup** - Static site generators and build tools are used to aggregate and pre-build markup before displaying to the end-user. Examples of static site generators are [Jekyll](http://jekyllrb.com/), [Hugo](https://gohugo.io/), [Docusaurus](https://docusaurus.io/) etc.\n\n*Note: you can have a look at the [top 10 static site generators](https://strapi.io/blog/top-10-static-site-generators-in-2020) article we published a few months ago.*\n\nJamstack sites are pre-rendered, without web servers, and are served statically directly from a static hosting infrastructure or CDN. What this means is that there is no server-side code in the Jamstack, all the website static and dynamic files are generated during the build process and uploaded into a CDN or Static file hosting infrastructure. These static files are then downloaded into the browser during request time, and maybe progressively enhanced in the browser before being shown to the end-user.\n\n\n## Benefits of using the Jamstack\n\n \n**Developer experience** : Jamstack websites are built without a web server or backend, this reduces complexity when building custom websites, it also allows your developers focus more on your front end and content delivery concerns. Deployment with the Jamstack is also easier than in a traditional web development stack, deployment in the Jamstack involves deploying your pre-rendered static files into a CDN or static hosting infrastructure, then serving these static files directly to your end-users during the request time.\n\n**Performance** : Jamstack sites are incredibly fast. All the website’s assets are pre-rendered during build time and stored in a CDN, so when the website is served to the end-user, there are no interference or back end delays.\n\n**Security**: Jamstack sites are a collection of static files served directly from a CDN during request time, no code is run during the request time, they are without any server, backend, or framework to hack, there are virtually no vulnerabilities. All your dynamic functions can also be handled by external APIs, this reduces your surface area of attack. Even though this process is not attack-proof, third party APIs are very secure and well maintained.\n\n**Cost** : Jamstack files are served statically from a CDN, hosting is less expensive, fewer resources are needed for scaling hence the cost of scaling is low compared to the traditional server-side architecture.\n\n\n## Getting started with the Jamstack in 2021\n\nIf you are a Jamstack newbie - use the guide below to choose your Jamstack development tools. \n\n**Choosing a Headless CMS** \n\nA headless CMS provides a user interface for creating, storing and editing your content, it also provides an API for accessing your content with your front-end framework.  \n[Strapi](https://strapi.io/features) is a leading open-source headless CMS. It’s 100% Javascript, fully customizable, and developer-first. \n\nPopular Headless CMS resources:\n\n- [Why you should use a Headless CMS](https://strapi.io/blog/frontend-developers-headless-cms).\n- [Full listing of all Headless CMS.](https://jamstack.org/headless-cms/) \n- [Top Headless CMS in 2020.](https://wiredelta.com/10-most-popular-headless-cms-of-2020/)\n- [Headless CMS and beyond.](https://dev.to/stephenajulu/jamstack-headless-cms-and-beyond-part-1-4ad8)\n\n**Choosing a Static site generator**\n\nThe static site generator is the most important part of your Jamstack architecture, it is used to generate all your website’s static assets during build time. Popular static site generators are : [Jekyll](http://jekyllrb.com/), [Hugo](https://gohugo.io/), [Gatsby](https://www.gatsbyjs.org/).\n\nPopular Static site generator resources \n\n- [Full listing of all Static site generators](https://jamstack.org/generators/).\n- [Netlify Guide on choosing the right Static site generator.](https://www.netlify.com/blog/2020/04/14/what-is-a-static-site-generator-and-3-ways-to-find-the-best-one/)\n- [Top Static site generators in 2020.](https://scotch.io/tutorials/top-10-static-site-generators-in-2020)\n- [Simplify your stack with a custom made static site generator.](https://www.smashingmagazine.com/2020/09/stack-custom-made-static-site-generator/)\n- [Strapi Static Websites](https://strapi.io/solutions/static-websites)\n\n**Choosing a CDN/ Static hosting infrastructure**\n\nA CDN will greatly increase the speed and performance of your website. There are numerous CDN available today, and most ship with automated deployment, CI/CD pipelines, cache invalidation features.  Popular CDNs are [Netlify](https://www.netlify.com/), [Firebase](https://firebase.google.com/), [Cloudflare](https://www.cloudflare.com/), [Fastly](https://www.fastly.com/), [Surge](https://surge.sh/).\n\nPopular CDN resources \n\n- [CDN(Content Delivery Network).](https://jamstack.org/glossary/cdn/)\n- [6 Modern Jamstack Hosting and Deployment Solutions.](https://bejamas.io/blog/jamstack-hosting-deployment/)\n- [What more can a CDN do on the JAMstack.](https://dev.to/shortdiv/what-more-can-a-cdn-do-on-the-jamstack-5cgj)\n\n**External APIs**\n\nA major advantage of the Jamstack is the ability to consume data from external sources with an API, this removes the need for building a backend of your own. This approach reduces complexity and helps to build sites faster.\n\nExternal API resources\n\n- [Programmable web API directory](https://www.programmableweb.com/category/all/apis).\n- [Is there a risk to relying on external APIs on the Jamstack](https://dev.to/shortdiv/is-there-a-risk-to-relying-on-external-apis-on-the-jamstack-3o0l).\n\n## The Jamstack Best Practices\n\n1. Store your entire code in GIT.\n2. Deploy your code in a CDN. This is not compulsory but you will save time and money compared to deploying on big cloud providers like AWS.\n3. Use modern build tools like Webpack, PostCSS, and Babel to ensure your site is compatible with all browsers. Most modern Static site generators ship with a build tool ie Hugo-extended and PostCSS.\n4. Use Automated building and Atomic deploys. You can easily do this with modern CDNs like Netlify.\n5. Ensure instant cache invalidation.\n\n\n## Links to popular Jamstack Communities\n\n- [Jamstack Community on Gitter](https://gitter.im/jamstack/community?at=5cdf1b450ac9852a95f61774)\n- [Jamstack Reddit Community](https://www.reddit.com/r/JAMstack/)\n- [Jamstack.org Slack Community](https://community.netlify.com/c/connect/39)\n- [Strapi Slack Community](https://slack.strapi.io/)\n\n## Popular Jamstack resources \n\n- [Jam](https://www.smashingmagazine.com/2019/06/jamstack-fundamentals-what-what-how/)[stack Fundamentals.](https://www.smashingmagazine.com/2019/06/jamstack-fundamentals-what-what-how/)\n- [Jam](https://bejamas.io/blog/jamstack/)[stack: The Cornerstone of Modern-day Web Development.](https://bejamas.io/blog/jamstack/)\n- [The Jamstack in 2020.](https://snipcart.com/blog/jamstack)\n- [The promise of the Jamstack.](https://strapi.io/blog/jamstack)",
                    "user": 33,
                    "created_at": "2020-11-16T16:29:04.750Z",
                    "updated_at": "2021-04-13T13:56:27.467Z",
                    "published_at": "2021-01-11T14:12:28.500Z"
                  },
                  {
                    "id": 208,
                    "title": "What is the Jamstack?",
                    "slug": "what-is-the-jamstack",
                    "publishedAt": "2020-11-19T11:00:00.000Z",
                    "status": "published",
                    "content": "*This article is a guest post by the awesome [**Zara Cooper**](https://zaracooper.github.io/). She’s a software developer and technical writer and wrote this blog post through the [Write for the Community](https://strapi.io/write-for-the-community) program.*\n\n# What is Jamstack?\nWeb technology evolves over time and new tools and architectures are created and designed to address different problems in legacy systems. These could be in the development process,  with performance, cost, user experience, scalability, and other system considerations. Jamstack is part of this evolution. But what exactly is it?\n\n[Jamstack](https://jamstack.org/) is a frontend stack/architecture. It’s an acronym that stands for **J**avascript, **A**PIs, and **M**arkup **stack**. In this architecture, markup that incorporates Javascript, is pre-built into static assets, served to a client from a CDN, and relies on reusable APIs for its functionalities. \n\nIn more common web architectures, a web page is built using resources like data from a database, templates, and other content every time it is requested from a server and the resultant output is returned to the client. Jamstack is different from these architectures in that a site is pre-built into static assets before deployment, and these assets are distributed through a CDN. \n\nThe markup in the stack is the pre-rendered HTML of a site. The most basic kinds of Jamstack sites are plain HTML files styled with CSS. Augmenting these static sites with Javascript makes them dynamic and adds interactivity to the content. The markup is compiled at build time and then deployed. Frontend build tools are often used to automate these processes. \n \nIn the Jamstack, **the frontend and the backend are completely separate**. The APIs are distinct reusable services that provide specific functionality to static sites like payments, authentication, search, image uploads, comment management, etc. They could be created in-house or provided by vendors. The decoupling of the frontend from the backend has created opportunities to use a wide range of APIs with the frontend. There all kinds of APIs available within the API economy like [Paypal](https://www.paypal.com/), [Algolia](http://algolia.com/), [Cloudinary](https://cloudinary.com/), [Auth0](https://auth0.com/), etc. \n\nJamstack was coined as a term to better communicate what this new kind of decoupled architecture should look like. It is important to note that technologies that separated the frontend from the backend, prebuilt the sites, and distributed them over a CDN pre-dated the term. However, it was crucial to have the terminology to collectively describe all the tools that used this architecture, to make it easy to evangelize, and to set up best practices. \n\nJamstack sites can be built in different ways using different tools and technologies. The most common types of Jamstack site build tools include static site generators like [Hugo](https://gohugo.io/), [Jekyll](https://jekyllrb.com/), [Gridsome](http://gridsome.org/), etc... and headless content management systems (CMSs) like [Strapi](https://strapi.io). \n\n## Challenges of Established Web Architectures\n\nTraditional web architectures tend to be monolithic systems and their constituent parts are often tightly coupled. Let’s take the example below. \n\n\n![Traditional Web Architecture](/uploads/s_87331_A997_B66803_E277_D6_BAD_9076_D42088_EA_2_D261_C40640_BBF_14_A6_C307_CE_1490_1603333352314_traditional_arch_118581ff4e.png)\n\nIn this type of architecture, when a page request is made from the client, the webserver routes the request to the app server based on the URL. The app server then makes a data request to the database. Once the database returns data, the app server combines the data and page templates and renders them into a response. It then sends the response to the webserver which in turn passes it along to the client. In some architectures, cache layers may exist between some of the parts to facilitate quicker responses. \n\nThis tightly coupled architecture has inherent risks and complications. These range from impacts on how users experience the site, the site’s development, complexity, performance, and its developers and team experience. \n\n**Performance Issues**\nWhenever a user requests a web page, it has to be built each time, multiple parts of the system need to be involved, and the response is passed along to several layers before it gets to the client. This slows down page load time. Some systems add caching layers to address this but implementing consistent caching can be difficult leading to users receiving varying results. The tight coupling also makes it challenging to migrate to better frameworks, update dependencies, or address bugs because it may adversely affect other parts of the system and take a long time to accomplish. These performance issues lead to lower visitor conversion on these sites. \n\n**Security Risks**\nTraditional architectures are made up of several parts, increasing the surface area that needs to be monitored and secured. Since all parts of the system are involved when processing a request, they are all vulnerable and possibly open to security threats. As a result of tight coupling, when security vulnerabilities are identified, developers have to choose between patching them and potentially breaking the site with the change. \n\n**Complex and Expensive Scaling**\nAnother consequence of tight coupling in this architecture is the expensive and complicated scaling. Because every response to a request needs to be built before serving, the parts of the architecture that build and serve responses need to be scaled to accommodate traffic increases. However, not all web pages need to be built for every request. A one-off build that generates a page to be served continually would suffice. As such, the part that builds the app and that one that serves it do not ideally receive the same traffic and should not be scaled at the same rate. But in this architecture, both are scaled proportionally. Scaling this architecture is generally pretty expensive because of the type of technology that's part of it. \n\n**Complicated Development and Maintenance**\nOwing to tight coupling, it's complicated to make changes, updates, and push out bug fixes because of the widespread effects it would have on the entire system. This impedes flexibility to implement designs and make regular updates to improve user experience and developer workflows. \n\n## Benefits of using Jamstack\n\nIn Jamstack, the frontend is completely separated from the backend. The frontend is prebuilt before deployment, APIs are used to provide services to it, and it is distributed through a CDN. So here's how a typical page request would be handled. \n\n\n![Jamstack architecture](/uploads/s_87331_A997_B66803_E277_D6_BAD_9076_D42088_EA_2_D261_C40640_BBF_14_A6_C307_CE_1490_1603578677335_JAM_stack_arch_f76dbcdb4a.png)\n\n\nWhen a client makes a request for a web page, the CDN looks up the pre-rendered web page that matches the URL and sends it as a response to the client. The simplicity of this architecture has a range of benefits. \n\n**Performance**\nCompared to traditional architecture, Jamstack drastically improves performance because its tiers are reduced. This means that responses to requests go through fewer tiers and are faster. The resources and time that would go into maintaining additional tiers in traditional architectures are invested in optimizing the remaining tiers. Since web pages are pre-rendered, **no building happens for each request**. This coupled with the fact that multiple tiers do not have to interface with each other to generate a response and **sites are delivered through a CDN**, contributes to faster responses. The potential for failures to occur is greatly reduced because of pre-deployment building and the minimized surface area of the architecture. Pre-building pages ensure that **any errors can be detected **early enough and fixed before users get to interact with the site. \n\nAnother benefit of the loose coupling of Jamstack is that it is easy to make changes, push updates, introduce new features, refactor code, and upgrade to better vendors without having to worry about breaking the system. However, the interface through which each of the components interacts must remain the same. \n\n**Reduced Cost**\nIn Jamstack, as a result of the decoupling, whole tiers/components may cease to exist in the infrastructure. If they do exist, they receive less traffic compared to the frontend and hence do not need to be scaled at the same rate. This heavily reduces the machine, labor, and software costs of the infrastructure. Jamstack sites are overall **cheaper to build, scale, and maintain**. \n\n**Easier to Secure**\nHaving fewer components, Jamstack sites have a significantly smaller surface area to secure, maintain, and monitor. There are fewer points of entry that attackers can exploit and are therefore less vulnerable. **No code is run on a server to build pages**, making it difficult to inject exploitative code in the site. **Services are outsourced** to vendors with domain expertise, who are better equipped to secure and maintain them.\n\n**Enhanced Team and Developer Productivity**\nThe Jamstack is simple because it has fewer components and is easier to understand. As such, developing and maintaining a site that uses this architecture tends to be a bit more **straightforward**. Developers of the site do not need to be completely adept at how each and every part of the system works. Since the components are loosely coupled and their boundaries clearly delimited, **developers can specialize** in the parts they work on. \n\nGiven the decreased number of tiers in the architecture, **fewer developers** are needed to work on the site. It also eliminates the need to have very specialized developers like DevOps engineers, SREs, etc. on teams. Since Jamstack sites are **pre-rendered**, there's no need to have replicated environments like development, staging, testing, etc. This substantially reduces the amount of work needed to set up and maintain these environments. Usually, with Jamstack sites, there's just one development environment and a pipeline for deployment. The reduced workload frees up time that allows developers on the team to **better focus** on understanding sections of the system they work on. \n\nJamstack sites make it easy to introduce new features and designs, make upgrades, and maintain them because their components are loosely coupled. Compared to traditional web architecture which is tightly coupled, implementing new designs is often tough, takes a long time, and has multiple complications. Developers working on these systems are often exasperated which sometimes leading to churn. Recruiting to replace them can also be challenging since developers may not want to work on inflexible projects. Using Jamstack sites means site additions and improvements are made **relatively fast, improving reliability**. \n\nJamstack site tools and technologies are widespread and modern. Jamstack best practices outline workflows that ensure productive and effective development. Most importantly, Jamstack allows teams to outsource complex services to vendors who provide, maintain, and secure APIs used on their sites. \n\n##  Jamstack with Static Site Generators\n\nStatic site generators are build tools that add content and data to templates and produce static web pages of a site. These generators can be used for Jamstack sites. They are especially useful for **large websites with many pages** since they **automate builds**. Some well-known site generators include Hugo, Gatsby, Jekyll, Next.js, etc. You can find an expanded list of these generators at this [**link**](https://jamstack.org/generators/). \n\n##  Jamstack with Headless CMSs\n\nA content management system controls the production and alteration of digital content. A CMS is headless when it lacks a frontend and only has a backend that adds, provides, and modifies the content through an API. In some instances, the headless CMS may be augmented with an admin portal for content organization, workflow setup, etc. Headless CMSs fall under the APIs in Jamstack. Strapi is a great example of a headless CMS. It's open-source and the content on it is provided through GraphQL or REST. \n\n## Jamstack Conventions\n\nTo get the full benefit of Jamstack, it's important to follow some best practices. These include:\n\n- **Host your code** in a shared repository and use a version control system like Git to make content collaboration and contribution easier.\n- **Leverage build tools** to complement your frontend and automate development tasks.   \n- **Automate site builds** since content changes are made often.\n- **Make use of atomic deployments**. An atomic deployment means that changes are never live until all modified files are uploaded. They make sure your site is always consistent with your visitors. \n- **Enforce instant cache invalidation** for a consistent site. \n- Always **rely on a CDN** because it ensures your site is delivered fast to your visitors. \n\n## Conclusion\n\nJamstack is an architecture for static websites that are built before deployment and distributed through a CDN. Services to the website are provided through APIs and there is a complete separation of the backend and frontend. Jamstack sites have **better performance**, are **easier to secure and scale**, and **cost a lot less** than sites built with traditional architectures. They can be created using static site generators or with headless CMSs. To find out more about Jamstack sites head on over to [jamstack.org](https://jamstack.org/).\n\nAnother article has been published about the Jamstack. Feel free to check it out: [Jamstack in 2021](https://strapi.io/blog/jamstack-in-2021)",
                    "user": 34,
                    "created_at": "2020-11-16T16:29:34.920Z",
                    "updated_at": "2021-04-13T14:19:43.423Z",
                    "published_at": "2020-11-16T16:29:34.920Z"
                  }
                ]
              },
              {
                "__component": "slices.newsletter-banner",
                "id": 126,
                "newsletter": null
              }
            ],
            "postCategories": [
              {
                "id": 14,
                "name": "Web Development ",
                "created_at": "2020-10-15T15:59:00.140Z",
                "updated_at": "2020-10-15T15:59:00.140Z"
              }
            ]
          }
        ]

        const posts = data.reduce((acc, curr) => {
          acc.push({
            title: curr.seo.metaTitle,
            link: curr.slug,
            content: curr.seo.metaDescription,
          });

          return acc;
        }, []);

        setState({ isLoading: false, posts, error: false });
      } catch (err) {
        if (isMounted.current) {
          setState({ isLoading: false, error: true, posts: [] });
        }
      }
    };

    fetchData();

    return () => {
      isMounted.current = false;
      source.cancel('abort');
    };
  }, []);

  return state;
};

export default useFetch;
