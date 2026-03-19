TABLE OF CONTENTS 
 
TABLE OF CONTENTS ..................................................................................................... i 
LIST OF FIGURES ............................................................................................................ iii 
LIST OF ABBREVIATIONS ............................................................................................. iv 
CHAPTER I: INTRODUCTION .........................................................................................1 
1.1  Background of the Project .........................................................................................1 
1.2 Issue/Problem of the Organization .............................................................................1 
1.3 Objective of Report ....................................................................................................2 
1.3.1 Primary Objectives ..............................................................................................2 
1.3.2 Secondary Objectives ..........................................................................................2 
1.4 Review of Work and Literature ..................................................................................2 
1.5 Development Methodology ........................................................................................3 
1.5.1 Project Framework ..............................................................................................3 
1.5.2 Data and Information ..........................................................................................4 
1.7 Report Organization ...................................................................................................4 
Chapter II: System Design ...........................................................................................5 
Chapter III: Implementation Plan .................................................................................5 
Chapter IV: Conclusion and Recommendations ..........................................................5 
CHAPTER II: SYSTEM DEVELOPMENT PROCESS .....................................................6 
2.1 Analysis ......................................................................................................................6 
2.1.1 Analysis of task ...................................................................................................6 
2.1.2 Problem and issue ..............................................................................................6 
2.1.3 Analysis of Possible Solutions ............................................................................7 
2.2 Requirement Specification .............................................................................................8 
2.2.1 Functional Requirements .....................................................................................8 
2.2.2 Use Case Diagram ...............................................................................................9 
2.2.4 Non-Functional Requirements .......................................................................... 11 
2.3 Methodology Analysis ..............................................................................................14 
2.3.2 Progressive Refinement .....................................................................................15 
2.3.3 Development Sprints (Incremental Model) .......................................................15 
2.4 System Design ..........................................................................................................16 
 
2.4.1 System Flowchart ..............................................................................................17 
2.4.2 Sequence Diagram .............................................................................................19 
2.4.3 Data Flow Diagram ...........................................................................................22 
2.4.4 E-R Diagram .....................................................................................................24 
2.5 System Implementation ............................................................................................26 
2.5.1 Tools Used .........................................................................................................27 
2.5.2 Unit Testing .......................................................................................................28 
2.6 Findings ....................................................................................................................30 
CHAPTER III: DISCUSSION AND CONCLUSION .......................................................32 
3.1 Summary ..................................................................................................................32 
3.2 Conclusion ................................................................................................................32 
3.3 Recommendations ....................................................................................................33 
REFERENCES ...................................................................................................................36 
BIBLIOGRAPHY ..............................................................................................................37 
APPENDICES ....................................................................................................................38 
 
 
   
 
 
 
 
 
 
 
 
 
 
 
 
 
 
  
 
LIST OF FIGURES   
Fig 1.1. Incremental Model ................................................................................................4 Fig 2.1 Use Case Diagram ................................................................................................10 Fig 2.2 System Flowchart .................................................................................................18 Fig 2.3 Customer Product Browsing Sequence Diagram ..............................................19 Fig 2.4 Customer Inquiry Submission Sequence Diagram ...........................................20 Fig 2.5 Test Drive Booking Sequence Diagram ..............................................................21 Fig 2.6 Admin review Moderation Sequence Diagram .................................................22 
Fig 2.7 Level 0 DFD ..........................................................................................................23 
Fig 2.8 Level 1 DFD ..........................................................................................................24 
Fig 2.9 ER- Diagram ........................................................................................................25 
   	   	 ‘ 
 
   
   
  
LIST OF ABBREVIATIONS    
CSS     :        Cascading Style Sheets   
DFD    :        Data Flow Diagram   
Django:        High-level Python Web Framework   
DB      :        dbsqlite3   
ER       :        Entity Relationship   
HTML :        Hypertext Markup Language   
JS        :        JavaScript   
IDE     :        Integrated Development Environment   
PC       :        Personal Computer   
SQL     :       Structured Query Language   
ORM   :        Object-Relational Mapping   
TU       :       Tribhuvan University   
U/I       :       User Interface   
UML   :        Unified Modeling Language   
          
 
 
CHAPTER I: INTRODUCTION   
1.1  Background of the Project   
The Shubhayaan EV Platform project has been undertaken as a comprehensive digital transformation initiative for Shubhayaan Electric Vehicles, a leading EV solutions provider in Nepal. This project aims to establish a modern, user-centric web platform that showcases the company's electric vehicle offerings, services, and brand values while facilitating customer engagement and business operations.  
  
Shubhayaan EV, operating in the competitive electric vehicle market in Nepal, recognized the need for a robust digital presence to:  
-	Showcase their product portfolio (Kaweii and Nevko models)  
-	Provide comprehensive service information and locations  
-	Enable customer interactions and inquiries  
-	Build brand authority through content and storytelling  
-	Streamline customer journey from awareness to purchase  
  
The platform integrates multiple business functions including product management, service location tracking, customer reviews, team information, and company journey documentation into a cohesive digital ecosystem.  
  
1.2 Issue/Problem of the Organization     
Through detailed research and stakeholder interviews, the following organizational challenges were identified:  
  
•	Limited Digital Presence: Lack of comprehensive online platform to showcase products and services  
•	Inefficient Customer Communication: No centralized system for handling inquiries, test drive bookings, and customer reviews  
•	Scattered Information: Product details, service locations, and company information dispersed across multiple channels  
•	Poor Customer Experience: Difficulty in accessing menu information, pricing, and service details  
•	Manual Order Processing: Test drive bookings and inquiries handled through manual processes  
•	Lack of Brand Storytelling: No platform to communicate company journey, team expertise, and organizational values  
•	Limited-Service Visibility: Service locations and facilities not clearly presented to customers  
  
1.3 Objective of Report   
The primary objectives of the Shubhayaan EV Platform are:  
1.3.1 Primary Objectives  
•	Digital Transformation: Establish a modern, responsive web platform for the EV company  
•	Product Showcase: Present electric vehicle models with detailed specifications and features  
•	Service Integration: Display all service locations with facilities and charging capabilities  
•	Customer Engagement: Enable customers to submit inquiries, book test drives, and leave reviews  
•	Brand Building: Communicate company values, team expertise, and organizational journey  
  
1.3.2 Secondary Objectives  
•	Operational Efficiency: Streamline customer interactions and reduce manual processes  
•	Market Presence: Establish authority in the EV market through content and information  
•	Customer Satisfaction: Provide seamless user experience across all touchpoints  
•	Data Collection: Gather customer insights through inquiries and reviews for business intelligence  
1.4 Review of Work and Literature   
• Global EV Market Context  
The electric vehicle industry has experienced exponential growth globally, with digital platforms playing a crucial role in customer acquisition and engagement. Leading EV manufacturers utilize comprehensive web platforms to showcase products, manage customer relationships, and provide service information.  
• Nepal's EV Sector  
Nepal's EV market is emerging with increasing consumer interest in sustainable transportation. However, many local EV companies lack sophisticated digital platforms, presenting an opportunity for market differentiation through superior online presence and customer experience.  
• Digital Platform Best Practices  
•	E-commerce Integration: Seamless product browsing and inquiry systems  
•	Service Location Management: Geolocation-based service finder with facility information  
•	Customer Review Systems: Trust-building through authentic customer testimonials  
•	Content Management: Dynamic content updates without technical expertise  
•	Mobile Optimization: Responsive design for diverse device access  
•	Performance Optimization: Fast loading times and smooth user interactions  
  
1.5 Development Methodology      
Methodology is a structured framework or set of principles and practices used to conduct research, implement projects, or solve problems. It outlines the methods, procedures, and techniques that will be used to achieve objectives and ensure consistent and reliable results.  Methodology used in this report is listed down below:   
1.5.1 Project Framework   
The Shubhayaan EV Platform employs a hybrid approach combining the Incremental Model with Agile methodology:  
  
 Incremental Model Benefits:   
•	Divides platform requirements into manageable modules  
•	Each increment undergoes complete development lifecycle (analysis, design, implementation, testing)  
•	Enables progressive delivery of features  
•	Reduces risk through staged implementation  
  
 Agile Practices:   
•	Short iterative sprints (2-week cycles)  
•	Regular stakeholder feedback and reviews  
•	Adaptive planning based on changing requirements  
•	Early delivery of working features  
•	Continuous refinement and improvement  
  
 Key Increments:   
•	Core Platform Infrastructure - Navigation, layout, basic pages  
•	Product Management - Vehicle showcase, specifications, features  
•	Service Integration - Location management, facility tracking  
•	Customer Engagement - Inquiries, reviews, test drive bookings  
•	Content Management - Team, journey, gallery, blog  
•	Admin Dashboard  - Content management, order tracking, analytics  
  
  
Fig 1.1. Incremental Model 
   
1.5.2 Data and Information     
The data and information play vital roles for the identification of possible threats and opportunities of any organization.    
Primary data means data that has been collected from employee and personal from the organization to which it is dedicated. In this project, data have been direct interviews with company stakeholders and management, observation of current business processes, customer feedback and requirements gathering, competitive analysis and market research.    
Secondary data includes information obtained from indirect sources. For this project, relevant data were collected from the internet, previous research reports, and articles related to digital menu and billing systems. These sources helped determine the most suitable technology and interface for the lodge.   
1.7 Report Organization   
This project report is structured into three main chapters, followed by references and appendices, to present the development and implementation of the QR Chef system in a systematic and logical manner.   
Chapter I: Introduction:  
-	Project background and context  
-	Problem statement and objectives  
-	Literature review and best practices  
-	Development methodology  
Chapter II: System Design  
-	Architecture and technology stack  
-	Database design and data models  
-	User interface and user experience design  
-	API specifications  
-	Security and performance considerations  
Chapter III: Implementation Plan  
-	Detailed task breakdown  
-	Timeline and milestones  
-	Resource allocation  
-	Testing strategy  
-	Deployment plan  
Chapter IV: Conclusion and Recommendations  
-	Project outcomes and achievements  
-	Impact on business operations  
-	Lessons learned  
-	Future enhancements and scalability  
-	Recommendations for maintenance and growth  
  
  
  
  
  
  
   
  
  
  
  
  
  
  
CHAPTER II: SYSTEM DEVELOPMENT PROCESS   
2.1 Analysis    
2.1.1 Analysis of task   
Developing the Shubhayaan EV Platform involves creating a comprehensive digital solution to establish a strong online presence for Shubhayaan Electric Vehicles, a leading EV solutions provider in Nepal. The main objective is to eliminate the fragmented information distribution across multiple channels and provide customers with a centralized platform to explore electric vehicle products, locate service centers and charging stations, submit inquiries, book test drives, and engage with the brand.  
  
The system enables customers to browse detailed product specifications for Kaweii and Nevko electric vehicle models, discover nearby service locations with facility information, read authentic customer reviews, learn about the company's journey and team, and seamlessly communicate with the business through integrated contact forms and chatbot support. Additionally, the platform provides administrators with powerful content management capabilities to update products, manage service locations, moderate reviews, and track customer inquiries, thereby streamlining business operations and enhancing customer satisfaction.  
2.1.2 Problem and issue    
The primary challenges faced by Shubhayaan Electric Vehicles include:  
  
•	Limited Digital Presence:  The absence of a comprehensive online platform makes it difficult for potential customers to discover and learn about the company's electric vehicle offerings, resulting in missed business opportunities and reduced market visibility.  
  
•	Inefficient Customer Communication:  Without a centralized system for handling inquiries, test drive bookings, and customer feedback, the company relies on manual processes through phone calls, emails, and social media messages, which are timeconsuming and prone to delays.  
  
•	Scattered Information:  Product details, service locations, charging station information, and company background are dispersed across various channels, making it challenging for customers to access comprehensive information in one place.  
  
•	Poor Service Visibility:  Customers struggle to locate nearby service centers and charging stations, understand available facilities (charging types, washing facilities), and access contact information, leading to frustration and reduced service utilization.  
  
•	Lack of Brand Storytelling:  Without a platform to communicate the company's journey, team expertise, and organizational values, Shubhayaan EV misses opportunities to build emotional connections with customers and establish brand authority in the competitive EV market.  
  
•	Manual Content Management:  Updating product information, service locations, and promotional content requires technical expertise and developer intervention, preventing timely updates and limiting the marketing team's agility.  
  
To address these challenges, the proposed Shubhayaan EV Platform aims to provide a modern, user-centric web application that consolidates all business functions into a cohesive digital ecosystem. By offering intuitive product browsing, location-based service discovery, seamless customer engagement tools, and an easy-to-use admin panel, the system eliminates information fragmentation, reduces manual workload, and significantly enhances the overall customer experience.  
2.1.3 Analysis of Possible Solutions     
To overcome the challenges associated with limited digital presence and inefficient customer communication, the proposed solution is a full-stack web platform with the following capabilities:  
•	Product Showcase Platform:  Enable customers to browse electric vehicle models (Kaweii and Nevko) with detailed specifications, pricing, features, and high-quality imagery, providing comprehensive product information in an organized, searchable format.  
•	Service Location Discovery:  Provide an interactive service directory with locationbased search, facility information (charging types, washing facilities), contact details, and integrated maps for easy navigation to service centers and charging stations.  
•	Customer Engagement Hub:  Implement contact inquiry forms, test drive booking system, customer review submission and display, and an intelligent chatbot for instant customer support and FAQ assistance.  
•	Content Management System:  Allow administrators to easily update product information, manage service locations, moderate customer reviews, track inquiries and bookings, and maintain company content without technical expertise.  
•	Brand Storytelling Platform:  Showcase the company's journey, team members, organizational values, and achievements through dedicated sections that build trust and establish market authority.  
•	Responsive User Experience: Ensure seamless functionality across all devices (mobile, tablet, desktop) with fast loading times, intuitive navigation, and accessibility compliance.  
  
This comprehensive solution eliminates information silos, streamlines customer interactions, reduces manual processes, and provides a modern digital presence that positions Shubhayaan EV as a technology-forward leader in Nepal's electric vehicle market.  
  
2.2 Requirement Specification  
The Shubhayaan EV Platform is designed to serve as a comprehensive digital ecosystem for electric vehicle sales, service management, and customer engagement. The system enables customers to explore products, locate services, submit inquiries, and interact with the brand, while providing administrators with powerful tools to manage content, track customer interactions, and analyze business performance.  
  
The requirements are categorized into functional and non-functional specifications as outlined below:  
2.2.1 Functional Requirements  
Functional requirements specify the essential tasks the Shubhayaan EV Platform must perform, including product management, customer engagement, content administration, and data analytics. These requirements define the core features that developers must implement to enable users to accomplish their objectives effectively.  
  
 Product Management:   
•	Product Display:  Present electric vehicle models with detailed specifications, pricing, features, battery capacity, range, charging time, and high-quality images in an organized, searchable format.  
•	Product Comparison:  Enable customers to compare different models side-by-side to make informed purchasing decisions.  
•	Category Filtering:  Allow filtering by vehicle category (Kaweii, Nevko), price range, and key specifications.  
  
 Service and Location Management:   
•	Service Directory:  Display comprehensive service locations with facility information, contact details, operating hours, and available services.  
•	Location-Based Search:  Provide search functionality by city, district, or proximity to user location with distance calculations.  
•	Charging Station Directory:  Present charging stations with charging types (fast, moderate, slow), washing facilities, and contact information.  
•	Interactive Maps:  Integrate maps with location markers and directions for easy navigation.  
 
 
  
 Customer Engagement:   
•	Contact Inquiries:  Enable customers to submit inquiries with form validation, confirmation emails, and admin tracking capabilities.  
•	Test Drive Booking:  Provide test drive scheduling with date/time selection, vehicle preferences, and booking confirmations.  
•	Customer Reviews:  Allow review submission with ratings, admin moderation workflow, and public display of approved reviews.  
•	Chatbot Support:  Implement FAQ chatbot for instant customer assistance and common query resolution.  
Content Management:   
•	Admin Dashboard:  Provide comprehensive dashboard for managing all platform content, tracking inquiries, and viewing analytics.  
•	Product CRUD Operations:  Enable administrators to create, read, update, and delete product information with image management.  
•	Service Location Management:  Allow management of service locations, facility updates, and contact information maintenance.  
•	Review Moderation:  Implement review approval workflow with status tracking (pending, approved, rejected).  
•	Team Management:  Enable management of team member profiles, designations, and organizational structure.  
•	Journey Content:  Provide tools to manage company milestones, achievements, and storytelling content.  
  
 Security and Access Control:   
•	Admin Authentication:  Implement secure login system with role-based access control for administrative functions.  
•	Data Validation:  Ensure all user inputs are validated and sanitized to prevent security vulnerabilities.  
•	File Upload Security:  Implement secure file upload with type validation and size restrictions.  
  
2.2.2 Use Case Diagram  
  
A Use Case Diagram illustrates the interaction between the Shubhayaan EV Platform and its primary actors. The diagram demonstrates how customers, administrators, and staff interact with various system functions, providing a clear overview of user roles and system capabilities.  
  
Fig 2.1 Use Case Diagram 
  
Actors in the Shubhayaan EV Platform  
  
 Customer:   
Customers are end-users who interact with the platform to explore electric vehicle products, locate services, and engage with the brand. Their journey includes browsing product catalogs, comparing vehicle specifications, searching for nearby service locations and charging stations, submitting contact inquiries, booking test drives, and leaving reviews. Customers access the platform through web browsers on various devices, expecting intuitive navigation, fast loading times, and comprehensive information to support their purchasing decisions.  
 Administrator:   
Administrators are responsible for managing the platform's content, monitoring customer interactions, and maintaining system functionality. Their key responsibilities include updating product information and specifications, managing service location details and facility information, moderating customer reviews and feedback, responding to customer inquiries and test drive bookings, maintaining team member profiles and company journey content, and analyzing platform usage statistics. Administrators require secure access to the admin panel with comprehensive content management tools that don't require technical expertise.  
  
 Staff:   
Staff members assist in operational tasks triggered by customer interactions and administrative workflows. They handle customer service inquiries, coordinate test drive appointments, manage service location operations, process customer feedback, and ensure timely response to customer communications. Staff act as the bridge between the digital platform and physical service delivery, helping maintain high customer satisfaction and operational efficiency.  
  
2.2.4 Non-Functional Requirements  
  
Non-functional requirements define how the Shubhayaan EV Platform should perform, focusing on quality attributes such as performance, usability, reliability, and security. These requirements ensure the system meets professional standards and provides an excellent user experience.  
  
 Performance:   
The platform must load pages within 3 seconds on standard internet connections and support concurrent users without performance degradation. API responses should be optimized with proper caching, database indexing, and efficient query patterns. Image and media files must be compressed and delivered through CDN for optimal loading speeds.  
 Availability and Reliability:   
The system must maintain 99.5% uptime with robust error handling and graceful degradation during peak traffic. Automated backups, monitoring systems, and failover mechanisms ensure continuous service availability for customers and administrators.  
  
 User-Friendly Interface:   
The interface must be intuitive and accessible, following modern web design principles with responsive layouts that work seamlessly across mobile, tablet, and desktop devices. Navigation should be logical, search functionality should be fast and accurate, and forms should provide clear validation feedback.  
 Compatibility:   
The platform must be compatible with modern web browsers (Chrome, Firefox, Safari, Edge) and mobile operating systems (iOS, Android). Progressive Web App (PWA) capabilities should provide app-like experiences on mobile devices with offline functionality for basic content viewing.  
  
 Security:   
The system must implement HTTPS encryption, secure authentication mechanisms, input validation and sanitization, CSRF protection, and secure file upload handling. Admin access must be protected with strong authentication, session management, and audit logging for all administrative actions.  
  
 Scalability:   
The architecture must support horizontal scaling to accommodate business growth, with modular design patterns that allow feature additions without system disruption. Database design should support efficient querying as data volume increases.  
  
2.2.5 Feasibility Study  
A comprehensive feasibility study evaluates whether the Shubhayaan EV Platform can be successfully developed, implemented, and maintained within the specified constraints. The study examines technical viability, operational practicality, and economic sustainability to ensure the platform delivers value to both customers and the business.  
  
 A. Technical Feasibility   
Technical feasibility confirms the availability of suitable technologies and development expertise for the platform's implementation. The Shubhayaan EV Platform utilizes proven technologies including Django REST Framework for backend API development, Next.js with TypeScript for frontend development, PostgreSQL for data management, and modern deployment practices with Docker containerization.  
  
These technologies are open-source, well-documented, and widely supported by the developer community, ensuring long-term maintainability and security updates. The development team possesses the required expertise in full-stack web development, API design, database management, and modern deployment practices. Integration with thirdparty services (maps, email, analytics) is well-established with comprehensive documentation and support.  
 B. Operational Feasibility   
Operational feasibility assesses whether the platform can be effectively adopted and utilized by all stakeholders. The system is designed with user-centric principles, featuring intuitive interfaces that minimize training requirements for both customers and administrators. The admin panel provides non-technical content management capabilities, allowing marketing and sales teams to update information independently.  
  
Customer-facing features follow familiar web patterns, ensuring easy adoption without learning curves. The platform supports existing business processes while introducing efficiency improvements through automation and centralized information management. Staff training requirements are minimal due to the intuitive design and comprehensive documentation.  
  
 C. Economic Feasibility   
Economic feasibility evaluates development costs, operational expenses, and return on investment. The platform leverages open-source technologies, significantly reducing licensing costs and vendor dependencies. Development costs are reasonable given the use of established frameworks and proven architectural patterns.  
  
Operational costs include hosting, domain registration, SSL certificates, and third-party service integrations (maps, email), all of which are industry-standard and scalable based on usage. The platform provides substantial cost savings through reduced manual processes, improved customer self-service capabilities, and enhanced marketing effectiveness.  
  
Long-term benefits include increased customer acquisition through improved online presence, reduced customer service workload through self-service features, enhanced brand credibility through professional digital presence, and valuable customer insights through analytics and feedback collection. 
 
2.2.6 System Analysis  
Traditional electric vehicle businesses in Nepal often rely on physical showrooms, wordof-mouth marketing, and manual customer service processes. This approach limits market reach, creates information bottlenecks, and provides inconsistent customer experiences. Customers struggle to access comprehensive product information, locate service facilities, and engage with brands efficiently.  
The Shubhayaan EV Platform addresses these limitations by providing a comprehensive digital ecosystem that centralizes all customer touchpoints. Customers can explore detailed product information, locate nearby services with facility details, submit inquiries and book test drives, read authentic reviews from other customers, and learn about the company's journey and expertise.  
  
The platform transforms customer engagement from reactive (waiting for customers to visit or call) to proactive (providing comprehensive information and multiple engagement channels). This digital-first approach positions Shubhayaan EV as an innovative leader in Nepal's evolving electric vehicle market while providing measurable improvements in customer satisfaction and operational efficiency.  
  
 2.3 Methodology Analysis  
The analysis phase for the Shubhayaan EV Platform followed an incremental development methodology combined with agile practices, enabling iterative feature development with continuous stakeholder feedback. This approach proved particularly effective for a multi-faceted platform serving diverse user needs including product browsing, service discovery, customer engagement, and content management.  
  
 2.3.1 Incremental Requirement Gathering  
 Increment 1: Core Platform Foundation   
The first increment focused on establishing the fundamental platform architecture and basic functionality. Analysis identified the need for a responsive web application with product display capabilities, basic navigation, and content management infrastructure. Core requirements included product catalog browsing, service location listing, and administrative content management. These foundational elements were modeled using user stories, use case diagrams, and database entity relationships.  
  
 Increment 2: Customer Engagement Features   
Based on initial stakeholder feedback, the second increment emphasized customer interaction capabilities. Analysis revealed the importance of inquiry forms, test drive booking, and review systems for building customer relationships. The platform was expanded to include contact forms with validation, test drive scheduling with date/time selection, and customer review submission with moderation workflows.  
  
 Increment 3: Service and Location Management   
Further input from business stakeholders highlighted the critical need for comprehensive service location management. The system was enhanced to include location-based search, facility information display (charging types, washing facilities), interactive maps integration, and distance calculations. This increment addressed the gap between digital presence and physical service delivery.  
  
 Increment 4: Advanced Features and Analytics   
The final increment incorporated advanced features based on user testing and business requirements. These included chatbot integration for customer support, analytics dashboard for business insights, gallery management for visual content, and company journey storytelling. While some features were planned for future releases, the analysis documented requirements for seamless future development.  
  
2.3.2 Progressive Refinement  
Each development increment enabled continuous refinement of system design models and technical specifications. Entity-Relationship Diagrams (ERDs) evolved to incorporate new entities such as ChatSession, JourneyGallery, and TestDriveEnquiry. Use Case Diagrams were updated to reflect expanded user interactions and administrative capabilities.  
  
User interface wireframes underwent multiple iterations based on usability testing feedback. After testing in Increment 2, the product browsing interface was redesigned for better mobile responsiveness and improved filtering capabilities. The admin panel interface was simplified based on feedback from non-technical users, ensuring content management tasks could be performed efficiently without technical expertise.  
  
This progressive refinement approach ensured the platform remained aligned with real business needs and user expectations, minimizing requirement ambiguity and promoting stakeholder clarity throughout the development process.  
  
2.3.3 Development Sprints (Incremental Model)  
Following the Incremental Development Model, the Shubhayaan EV Platform development was structured into focused sprints, each delivering specific modules with iterative development and validation. The following table summarizes key deliverables and implemented features:  
 
2.4 System Design  
System design defines the architecture, components, interfaces, and data flows of the Shubhayaan EV Platform. The design creates a structured approach to development, ensuring efficient integration, data management, and scalable architecture that supports current requirements and future expansion.  
The primary focus is on designing a centralized database that stores product information, service locations, customer interactions, and content management data. This database enables efficient data retrieval, supports complex queries for location-based searches, and maintains data integrity across all platform features.  
  
 2.4.1 System Flowchart  
System flowcharts visually map data movement through the Shubhayaan EV Platform, illustrating user interactions, decision points, and system responses. The flowchart begins when a customer visits the platform homepage, where they can choose to browse products, search for services, submit inquiries, or access company information.  
  
For product browsing, customers can filter by category, view detailed specifications, and compare models. Service discovery allows location-based search with facility filtering and map integration. Customer engagement flows include inquiry submission with validation, test drive booking with confirmation, and review submission with moderation. Administrative flows encompass content management, inquiry tracking, and analytics review.   
  
Fig 2.1 System Flowchart 
  
 Figure 2.3: System Flowchart   
2.4.2 Sequence Diagram  
A Sequence Diagram illustrates time-ordered interactions between system components within the Shubhayaan EV Platform. The diagram focuses on message flow between frontend components, API endpoints, business logic, and database operations, demonstrating how the system processes customer requests, manages data updates, and delivers responses.  
  
Key sequences include product browsing with filtering, service location search with distance calculation, inquiry submission with validation and email notification, review submission with moderation workflow, and admin content management operations.  
 
  
0.2 Customer Product Browsing Sequence Diagram 
  
Fig 2.3 Customer Inquiry Submission Sequence Diagram 
  
0.4 Test Drive Booking Sequence Diagram 
 
  
0.5 Admin review Moderation Sequence Diagram 
2.4.3 Data Flow Diagram  
Data Flow Diagrams (DFDs) visually represent information flow within the Shubhayaan EV Platform, illustrating how data moves between external entities (customers, administrators), processes (product browsing, inquiry processing, content management), and data stores (product database, customer database, content repository).  
  
 A. Level 0 Data Flow Diagram   
  
The Level 0 DFD provides a high-level overview of the platform's core functions, showing how customers interact with the system through product browsing, service discovery, and inquiry submission, while administrators manage content and monitor customer interactions.  
  
0.6 Level 0 DFD 
  
 B. Level 1 Data Flow Diagram   
  
The Level 1 DFD expands core processes into detailed sub-processes:  
  
•	Product Information Retrieval:  System fetches product details, specifications, and images from the database for customer browsing  
•	Location-Based Service Search:  System processes location queries, calculates distances, and filters service locations based on customer criteria  
•	Inquiry Processing:  System validates customer inquiries, stores data, sends confirmations, and notifies administrators  
•	Review Management:  System handles review submissions, implements moderation workflow, and displays approved reviews  
•	Content Administration:  System enables administrators to update products, manage locations, and track customer interactions  
  
2.7 Level 1 DFD 
2.4.4 E-R Diagram 
The Entity Relationship (ER) diagram represents the logical structure of the Shubhayaan system database and illustrates how different entities within the system are related to each other. In the ER diagram, entities such as Customer, Product, Service, and Review are represented using rectangular shapes, while their attributes are shown using oval shapes connected to the respective entities. The primary key of each entity is underlined to uniquely identify each record within the database. Relationships between entities are represented using diamond shapes, indicating how different entities interact with one another. For example, a customer can search products and services and can submit reviews for the services or products they use. This diagram helps in understanding the data organization, relationships among entities, and how information flows within the system. Overall, the ER diagram serves as a blueprint for designing the database structure of the Shubhayaan platform and ensures efficient data management and integrity. 
  
0.8 ER- Diagram 
 
2.5 System Implementation  
System implementation involves the practical realization of the Shubhayaan EV Platform design through coding, integration, testing, and deployment. The implementation process transforms design specifications into a functional web application that meets all specified requirements and provides excellent user experience.  
The implementation process encompasses the following key phases:  
  
The development process began with establishing the technical foundation using modern web technologies. The backend was developed using Django REST Framework, providing robust API endpoints, authentication, and database management. The frontend was built with Next.js and TypeScript, ensuring type safety, server-side rendering, and optimal performance.  
  
Key features implemented during the coding phase included:  
•	Product Management System:  Complete CRUD operations for electric vehicle products with image handling, specification management, and category filtering  
•	Service Location Directory:  Location-based search with distance calculations, facility information display, and interactive map integration  
•	Customer Engagement Tools:  Contact inquiry forms with validation, test drive booking system with date/time management, and review submission with moderation workflow  
•	Administrative Interface:  Comprehensive admin panel for content management, customer interaction tracking, and analytics dashboard  
•	Responsive Design:  Mobile-first approach ensuring optimal user experience across all devices  
  
 2. Testing  
  
Comprehensive testing was integral throughout development to ensure system reliability, security, and performance. The testing strategy included multiple levels of validation:  
  
•	Unit Testing:  Individual components and functions tested in isolation to verify correct behavior and edge case handling  
•	Integration Testing:  API endpoints tested with database interactions to ensure proper data flow and business logic execution  
•	Property-Based Testing:  Automated testing of system properties such as data completeness, validation accuracy, and CRUD operation correctness  
•	User Acceptance Testing:  Real-world scenarios tested with stakeholders to validate user experience and business requirements  
•	Performance Testing:  Load testing and optimization to ensure fast response times and scalability  
•	Security Testing:  Validation of authentication, authorization, input sanitization, and data protection measures  
  
3. Deployment  
Following successful testing, the system was deployed using modern DevOps practices with containerization and automated deployment pipelines. The backend API was deployed with Gunicorn and PostgreSQL database, while the frontend was optimized for production with static asset optimization and CDN integration.  
  
Deployment considerations included:  
•	Environment Configuration:  Separate development, staging, and production environments with appropriate security configurations  
•	Database Migration:  Automated database schema updates and data migration procedures  
•	Static Asset Management:  Optimized image delivery, CSS/JavaScript minification, and CDN integration  
•	Monitoring and Logging:  Comprehensive application monitoring, error tracking, and performance analytics  
•	Backup and Recovery:  Automated database backups and disaster recovery procedures  
  
4. Post-Deployment Support  
Continuous support and maintenance were established to ensure long-term system reliability and user satisfaction. Post-deployment activities included:  
•	Performance Monitoring:  Real-time application performance tracking with automated alerting for issues  
•	User Feedback Collection:  Systematic gathering of customer and administrator feedback for continuous improvement  
•	Bug Resolution:  Rapid response to reported issues with systematic debugging and resolution procedures  
•	Feature Enhancement:  Iterative improvements based on user needs and business requirements  
•	Security Updates:  Regular security patches and vulnerability assessments  
•	Documentation Maintenance:  Keeping technical and user documentation current with system changes  
  
2.5.1 Tools Used  
The Shubhayaan EV Platform was developed using a modern technology stack that ensures scalability, maintainability, and excellent performance:  
  
 Backend Technologies:   
•	Python:  Primary backend programming language for business logic and API development  
•	Django:  High-level web framework providing robust ORM, authentication, and admin interface  
•	Django REST Framework:  API development framework with serialization, authentication, and browsable API interface  
•	PostgreSQL:  Production database management system with advanced querying and indexing capabilities  
•	SQLite:  Development database for rapid prototyping and testing   Frontend Technologies:   
•	Next.js:  React framework with server-side rendering, routing, and optimization features  
•	TypeScript:  Type-safe JavaScript development with enhanced IDE support and error prevention  
•	React:  Component-based UI library for building interactive user interfaces  
•	Tailwind CSS:  Utility-first CSS framework for rapid, responsive design development •  React Icons:  Comprehensive icon library for consistent visual elements  
  
 Development Tools:   
•	Visual Studio Code:  Primary IDE with extensions for Python, TypeScript, and web development  
•	Git:  Version control system with branching strategies for collaborative development  
•	Docker:  Containerization for consistent development and deployment environments  
•	Postman:  API testing and documentation tool for backend endpoint validation  
  
 Third-Party Integrations:   
•	Google Maps API:  Interactive maps and location services for service directory  
•	Email Services:  SMTP integration for inquiry confirmations and notifications  
•	Image Optimization:  Automated image compression and format conversion for performance  
 
2.5.2 Unit Testing  
Comprehensive unit testing was conducted throughout the development process to ensure code quality, reliability, and maintainability. Each component was tested in isolation with automated test suites covering normal operations, edge cases, and error conditions.  
  
 A. Test Case Example   
  
 Title:  Shubhayaan EV Platform - Customer Inquiry Submission  
 Unit Name:  Contact Inquiry Processing  
 Precondition:  The system database contains valid service and product data  
 Assumption:  The contact form UI includes required fields for name, email, phone, subject, and message  
  
 Test Steps:   
1.	Navigate to the contact page  
2.	Fill in all required form fields with valid data  
3.	Submit the contact inquiry form  
4.	Verify form validation and submission processing  
  
 Expected Result:   
•	Form data should be validated for required fields and format correctness  
•	Valid submissions should be stored in the database with timestamp  
•	Confirmation email should be sent to the customer  
•	Admin notification should be generated for follow-up • Success message should be displayed to the customer  
 Table 2.2: Contact Inquiry Validation Test    
 
Completing the Shubhayaan EV Platform revealed significant insights into the electric vehicle industry in Nepal and demonstrated how comprehensive digital solutions can transform customer engagement and business operations. The project highlighted the critical importance of centralized information management and the substantial impact of user-centric design on customer satisfaction and business growth.  
Through this comprehensive web platform, I identified the significant gap between traditional automotive marketing approaches and the digital expectations of modern consumers, particularly in the emerging electric vehicle sector. The platform successfully addressed the challenge of information fragmentation by providing a single, authoritative source for product specifications, service locations, customer reviews, and company information, resulting in improved customer confidence and reduced inquiry response times.  
  
The project demonstrated the effectiveness of location-based services in the Nepali context, where customers prioritize proximity to service centers and charging infrastructure when making vehicle purchasing decisions. The integration of interactive maps, distance calculations, and facility information proved essential for customer decision-making, highlighting the importance of comprehensive service visibility in the EV market.  
  
Furthermore, the implementation revealed the critical role of customer reviews and testimonials in building trust for electric vehicle adoption. The moderated review system with rating capabilities provided authentic customer feedback while maintaining quality control, contributing to increased customer confidence and improved brand credibility.  
  
The development process highlighted the differences between theoretical system design and practical implementation challenges, particularly in handling real-world data variations, user behavior patterns, and performance optimization requirements. I gained valuable experience in full-stack development using Django REST Framework and Next.js, discovering efficient patterns for API design, state management, and responsive user interface development.  
  
The testing phase confirmed that the platform successfully meets all specified requirements while providing excellent user experience across devices. Performance testing validated the system's ability to handle concurrent users and large datasets, while security testing ensured robust protection of customer data and administrative functions.  
  
 
 
 
 
 
 
 
CHAPTER III: DISCUSSION AND CONCLUSION  
3.1 Summary   
The main objective of this project was to develop a comprehensive digital platform for Shubhayaan Electric Vehicles to establish a strong online presence and streamline customer engagement in Nepal's emerging EV market. Throughout the development process, I encountered various challenges, such as implementing location-based service discovery with accurate distance calculations, integrating complex product specifications with userfriendly interfaces, and ensuring optimal performance across diverse devices and network conditions. However, each challenge provided opportunities to explore innovative solutions and enhance my full-stack development expertise.  
  
Despite the technical complexities, the project progressed systematically through incremental development cycles, and the final platform successfully met all specified business requirements. The system enables customers to explore electric vehicle products with detailed specifications, discover nearby service locations and charging stations, submit inquiries and book test drives, read authentic customer reviews, and learn about the company's journey and expertise—all through an intuitive, responsive web interface.  
  
This project proved to be an invaluable learning experience, combining advanced web development technologies including Django REST Framework, Next.js with TypeScript, PostgreSQL database management, and modern deployment practices. By implementing a platform that addresses the complete customer journey from awareness to purchase consideration, I not only solved Shubhayaan EV's immediate digital presence challenges but also created a scalable foundation for future business growth. Moving forward, I am confident that the platform will significantly enhance customer engagement, improve lead generation, and position Shubhayaan EV as a technology-forward leader in Nepal's electric vehicle industry.  
  
3.2 Conclusion  
The completion of the Shubhayaan EV Platform represents a transformative milestone in establishing the company's digital presence and modernizing customer engagement processes. The platform's comprehensive feature set, including detailed product showcases, location-based service discovery, integrated customer communication tools, and powerful administrative capabilities, provides a seamless digital experience that addresses the complete customer journey from initial interest to purchase consideration.  
  
The successful development and implementation of this full-stack web application demonstrate the effective application of modern web technologies and user-centric design principles to solve real-world business challenges. The platform's responsive design, intuitive navigation, robust backend architecture, and comprehensive content management system create a professional digital presence that enhances brand credibility and customer trust in the competitive EV market.  
  
This system is expected to significantly improve customer acquisition through enhanced online visibility, reduce manual customer service workload through self-service capabilities, increase customer confidence through authentic reviews and comprehensive information, and provide valuable business insights through integrated analytics and customer interaction tracking. The platform establishes Shubhayaan EV as an innovative, customer-focused organization that leverages technology to deliver superior customer experiences.  
  
The successful delivery of this project demonstrates my ability to analyze complex business requirements, design scalable system architectures, implement robust full-stack solutions, and deliver production-ready applications that create measurable business value. I believe this platform will play a critical role in Shubhayaan EV's continued growth and success in Nepal's evolving electric vehicle market.  
 3.3 Recommendations  
While the Shubhayaan EV Platform successfully addresses the primary challenges of digital presence and customer engagement, there are several opportunities for future enhancement and expansion. Below are recommended improvements and additional features that could further strengthen the platform's value proposition:  
  
Immediate Enhancements  
•	Advanced Search and Filtering:  Implement sophisticated product search with filters for price range, battery capacity, charging time, and range per charge. Add comparison tools that allow customers to evaluate multiple vehicle models side-byside with detailed specification comparisons.  
  
•	Enhanced Location Services:  Integrate real-time availability status for charging stations, showing current usage and estimated wait times. Add route planning functionality that helps customers plan trips based on charging station locations and vehicle range capabilities.  
  
•	Customer Account Management:  Develop user registration and login system with personalized dashboards where customers can track their inquiries, save favorite products, manage test drive appointments, and receive personalized recommendations based on their preferences.  
  
•	Mobile Application:  Create native mobile applications for iOS and Android to provide app-like experiences with push notifications for inquiry responses, test drive reminders, and new product announcements.  
  
  
Advanced Features  
  
•	Virtual Showroom:  Implement 360-degree product views, virtual reality experiences, and augmented reality features that allow customers to visualize vehicles in their own environment using smartphone cameras.  
  
•	Financing Calculator:  Integrate loan calculation tools with partnerships with financial institutions, allowing customers to explore financing options, calculate monthly payments, and submit preliminary loan applications directly through the platform.  
  
•	Service Booking System:  Expand beyond test drives to include comprehensive service appointment booking for maintenance, repairs, and vehicle inspections, with calendar integration and automated reminders.  
  
•	Customer Community:  Create forums or discussion areas where EV owners can share experiences, ask questions, and provide peer-to-peer support, building a community around the Shubhayaan EV brand.  
  
Business Intelligence and Analytics  
  
•	Advanced Analytics Dashboard:  Implement comprehensive business intelligence tools that provide insights into customer behavior patterns, popular products, geographic demand distribution, conversion funnel analysis, and ROI tracking for marketing campaigns.  
  
•	Customer Relationship Management (CRM):  Integrate CRM functionality to track customer interactions across all touchpoints, manage sales pipelines, automate follow-up communications, and provide personalized customer service.  
  
•	Inventory Management Integration:  Connect the platform with inventory management systems to show real-time vehicle availability, estimated delivery times, and automatic updates when new stock arrives.  
  
Marketing and Engagement  
  
•	Content Management System:  Expand content capabilities to include blog functionality for sharing EV industry news, maintenance tips, sustainability content, and company updates to improve SEO and customer engagement.  
  
•	Email Marketing Integration:  Implement automated email campaigns for lead nurturing, customer onboarding, service reminders, and promotional announcements based on customer preferences and behavior.  
  
•	Social Media Integration:  Add social sharing capabilities, customer photo galleries, and integration with social media platforms to amplify brand reach and encourage usergenerated content.  
  
 Technical Improvements  
  
•	Performance Optimization:  Implement advanced caching strategies, image optimization, and content delivery network (CDN) integration to further improve page load times and user experience.  
  
•	Multi-language Support:  Add Nepali language support and potentially other regional languages to make the platform accessible to a broader customer base.  
  
•	API Ecosystem:  Develop public APIs that allow third-party developers to integrate with the platform, potentially creating an ecosystem of complementary services and applications.  
  
These recommendations provide a roadmap for continuous platform improvement and business growth, ensuring that Shubhayaan EV remains at the forefront of digital innovation in Nepal's electric vehicle industry.   
   
   
   
   
   
   
   
   
   
   
   
   
 
 
 
   
   
   
 
REFERENCES   
Pressman, R. S., & Maxim, B. R. (2020).  Software Engineering: A Practitioner's Approach  (9th ed.). McGraw-Hill Education.  
  
Django REST Framework. (2024).  Django REST Framework Documentation . Retrieved from https://www.django-rest-framework.org/  
  
Vercel Inc. (2024).  Next.js Documentation: The React Framework for Production . Retrieved from https://nextjs.org/docs  
  
International Energy Agency. (2023).  Global EV Outlook 2023: Catching up with Climate Ambitions . IEA Publications.  
  
 Government of Nepal. (2020).  National Electric Mobility Policy 2020 . Ministry of Physical Infrastructure and Transport.  
  
Krug, S. (2014).  Don't Make Me Think, Revisited: A Common Sense Approach to Web Usability  (3rd ed.). New Riders.  
  
Myers, G. J., Sandler, C., & Badgett, T. (2019).  The Art of Software Testing  (3rd ed.).  
John Wiley & Sons.  
  
Schwaber, K., & Sutherland, J. (2020).  The Scrum Guide: The Definitive Guide to Scrum . Scrum.org.  
  
  
  
  
  
  
  
  
  
  
  
  
 
 
  
   
BIBLIOGRAPHY   
Bootstrap Team. (2023). Bootstrap documentation.     
https://getbootstrap.com/docs/5.3/getting-started/introduction/   
Chart.js. (2023). Chart.js documentation.    
https://www.chartjs.org/docs/latest/   
DENSO WAVE. (2023). QR Code essentials. Denso Wave Incorporated.    
https://www.qrcode.com/en/about/   
Django REST framework. (2023). Django REST framework documentation.  
https://www.django-rest-framework.org/   
	Django 	Software 	Foundation. 	(2023). 	Django 	documentation.  
https://docs.djangoproject.com/en/4.2/ JGraph Ltd. (2023).  
Diagrams.net (draw.io).  https://app.diagrams.net/ jQuery  
Foundation. (2023). jQuery API documentation.    
https://api.jquery.com/   
Python Software Foundation. (2023). Python documentation.    
https://docs.python.org/3/   
Refsnes Data. (2023). W3Schools Online Web Tutorials.   
 https://www.w3schools.com/   
SQLite Consortium. (2023). SQLite documentation.   
 https://www.sqlite.org/index.html   
   
   
   
   
  
  
  
  
  
APPENDICES  
  
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
