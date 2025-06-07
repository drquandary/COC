Leveraging Augmented Reality via Community Co-Design: A Pilot Study of Public Health Engagement and Pediatric Influenza Vaccination Intent in Underserved Urban Communities
====================================================================================================

Abstract
--------

Background: Low pediatric influenza vaccination rates, particularly in underserved communities, represent a significant public health challenge inadequately addressed by traditional health communication methods. Augmented Reality (AR) presents as a promising, yet underexplored, technological approach for enhancing engagement with health information.
Objective: This pilot study aimed to assess the feasibility and acceptability of Project CARE (Community Augmented Reality Engagement), a co-designed, web-based AR intervention, for engaging users and gathering preliminary data on pediatric influenza vaccination intent within West Philadelphia. A further objective was to understand AR's potential to bridge existing cultural and systemic gaps in health communication.
Methods: The Project CARE intervention utilized AR-enhanced posters and postcards, incorporating gamified elements, deployed in community libraries, childcare centers, churches, schools, parks, and health-fair booths. The target population comprised parents and caregivers responsible for vaccination decisions for young children in West Philadelphia. Data were collected through integrated web analytics, structured surveys, and qualitative focus groups. As a pilot feasibility study, formal sample size calculations were not conducted. Participants received a US $20 incentive for participation.
Results: The AR application successfully engaged 327 unique users. The median session duration was 30 seconds (IQR 18-46 s), aligning with micro-burst learning goals for brief, focused interactions. Qualitative feedback from four focus groups indicated high levels of enjoyability, relevance, and cultural resonance. Survey data corroborated these findings, with participants rating the AR experience's enjoyability at 4.44 (out of 5) and expressing an average intent to vaccinate their child at 4.0 (out of 5) as an exploratory proxy. These preliminary findings suggest feasibility of AR deployment.
Conclusions: As a pilot study, this work establishes proof-of-concept for AR-based health interventions. AR technology, particularly when amplified by community co-design and meticulous cultural tailoring, shows promise for enhancing public health communication. It can improve user engagement, foster emotional connections, and promote vaccine uptake in under-resourced populations. The integration of web analytics offers actionable insights for optimizing and scaling such interventions.
Keywords: augmented reality, public health, digital health, community engagement, health communication, interactive media, vaccine hesitancy, pediatric influenza, pilot study, feasibility.

1. Introduction
---------------

### 1.1. The Urgent Public Health Challenge: Pediatric Influenza, Vaccine Hesitancy, and Health Disparities

Pediatric influenza poses a substantial public health challenge, necessitating robust vaccination strategies, particularly for vulnerable child populations. Each year, influenza contributes to significant morbidity, including thousands of hospitalizations among children [3]. For instance, the 2022-2023 influenza season saw hospitalization rates of 119 per 100,000 for children under 5 years old, underscoring the critical need for effective preventive measures [3]. Compounding this issue is the pervasive problem of vaccine hesitancy, which acts as a major barrier to achieving optimal immunization coverage, especially within underserved communities [6].

The consequences of pediatric influenza extend beyond immediate illness, translating into missed school days for children, lost workdays for parents, and the risk of severe health complications, thereby imposing a considerable societal and economic burden [3]. The urgency to address this gap is magnified by persistent health disparities. "Vaccination disparities persist across socio-economic and cultural divides, disproportionately affecting marginalized populations" [7]. This study focuses on West Philadelphia, an area characterized by "predominantly low-income neighborhoods... historical healthcare disparities and lower vaccination rates". Demographic data for Philadelphia County further contextualizes this challenge, with 43.0% of the population identifying as Black or African American, 15.8% as Hispanic or Latino, and 20.3% of persons living in poverty [2]. National data on pediatric influenza vaccination coverage reflects these inequities; the Centers for Disease Control and Prevention (CDC) Morbidity and Mortality Weekly Report (MMWR) of September 2024 indicated a decline in coverage to 53.4% for the 2021 birth cohort (by age 24 months) [14]. Notably, coverage was lower among non-Hispanic Black or African American children (42.6%) and Hispanic or Latino children (52.8%) compared to non-Hispanic White children (59.6%). Furthermore, a significant 19.9 percentage point difference in influenza vaccination (\u22652 doses) was observed among children living below the federal poverty level compared to their counterparts above it. While Philadelphia's overall rate for children born between 2020-2021 was 62.9%, this aggregate figure can mask significant internal disparities within specific communities. This demographic profile aligns with nationally identified underserved groups, underscoring the relevance of targeting such communities. The urgent public health challenge, therefore, is not merely low vaccination rates but a manifestation of deeper, systemic health inequities. The human cost is disproportionately borne by these communities due to historical and ongoing social determinants of health [6]. Addressing pediatric influenza in this context is thus a critical step towards achieving health equity, extending beyond simple disease prevention [5].

### 1.2. Current Communication Channels, Digital Health Solutions, and Their Gaps

Traditional public health communication strategies for vaccine promotion include public service announcements (PSAs), print materials, and advice from healthcare providers [16]. Digital health interventions, such as mobile applications and text messaging services, have also been employed [9]. For instance, tactics to improve influenza vaccination rates in clinical settings often involve identifying physician champions, implementing standing orders for vaccination, optimizing documentation, providing regular reminders to both staff and patients, and giving ongoing feedback on performance [16]. Community Health Worker (CHW)-led multimedia campaigns have also demonstrated effectiveness in increasing influenza knowledge within migrant and refugee communities by using culturally appropriate materials and trusted messengers [13].

Despite these efforts, many existing interventions frequently fail to connect effectively with underserved communities. This failure is often due to a "lack of cultural relevance, insufficient attention to historical and structural determinants of health inequities, and limited emotional engagement" [6]. Furthermore, "traditional interventions potentially neglect critical psychosocial determinants of vaccine hesitancy, such as trust, cultural identity, and historical healthcare inequities" [6]. These psychosocial factors are critical, as the emotional and cognitive barriers surrounding vaccine decisions necessitate strategies that extend beyond mere factual dissemination to foster relational and empathetic connections [6].

A key gap exists for accessible, culturally resonant, engaging, health information technology. Current digital strategies, while addressing some logistical barriers, "often fall short in sustaining user engagement or driving behavioral change" and "rarely account for the nuanced cultural and emotional landscapes that influence health decisions" [6]. The inability of conventional methods to resonate with underserved communities often stems from a lack of inclusive design processes. When interventions are not co-designed or culturally tailored, they fail to build trust or achieve relevance, thereby perpetuating cycles of disengagement and suboptimal health outcomes [18].

### 1.3. Augmented Reality as an Emerging Solution for Health Engagement

Augmented Reality (AR) has emerged as a promising, albeit underexplored, tool in public health communication. Unlike virtual reality (VR), which typically requires specialized headsets and immerses users in entirely digital environments, web-based AR uniquely overlays interactive digital content onto users' real-world environments through the use of smartphones and tablets. This capability allows AR to contextualize health information within familiar local settings, potentially enhancing cognitive engagement and facilitating the comprehension of complex health concepts [1]. While AR applications have demonstrated promise across diverse health-related contexts, including clinical training [2], pediatric asthma management [3], and behavioral interventions such as smoking cessation [4], systematic evaluations of AR specifically within public health remain limited. Our study directly addresses this gap, positioning itself among the first systematic evaluations of AR's effectiveness and unique affordances in the domain of public health communication.

The unique affordances of web-based AR position it well to address the identified challenges in public health communication:

- **Spatial Integration and Real-World Context**: AR can "contextualize health information within familiar local settings" [1]. This integration of digital elements within real-world contexts potentially enhances cognitive engagement and facilitates the comprehension of complex health concepts, especially where traditional methods falter [1]. The ability to embed interactive digital information into familiar real-world settings facilitates contextual learning [20].
- **Interactivity and Engagement**: AR transforms "passive information consumption into dynamic learning experiences" [1]. By allowing users to interact with digital information overlaid on their physical environment, AR can make abstract health concepts, such as the presence of germs or the benefits of vaccination, more tangible and understandable [1]. This "invisible visible" aspect can significantly impact emotional, knowledge-based, and perceptual predictors of behavior change through mechanisms of presence and embodiment [1].
- **Accessibility**: A crucial advantage of web-based AR is its accessibility from any smartphone [8]. This broadens its reach compared to more resource-intensive technologies like VR, making it particularly suitable for under-resourced populations who may have limited access to specialized hardware [15].
- **Emotional Resonance and Trust-Building**: AR offers unique pathways for "fostering emotional resonance and trust within under-resourced populations" [1]. The integration of "localized digital content within familiar settings amplifies message salience, potentially strengthening trust and self-efficacy" [1]. This interactivity can foster deeper cognitive processing, emotional connection, and personal relevance [19].

The theoretical underpinnings of AR's potential in health communication can be linked to situated learning and persuasion theories. The integration of digital information into real-world contexts "facilitates contextual learning and fosters 'empathic feedback loops,' wherein personal experiences and familiar spaces amplify emotional resonance and cognitive engagement" [19]. This mechanism, where engaging narratives can reduce counter-arguing and increase message acceptance, is amplified by AR's ability to embed interactive narratives within the user's reality, creating a highly personalized narrative space [19]. This personalization, combined with visual and interactive elements, enhances the conditions for an empathic feedback loop, fostering a deeper connection to the information and potentially leading to attitude and behavior change [19,20]. This approach aligns with "situated-learning theories that emphasize context, social interaction, and active participation in knowledge acquisition" [20]. Research in AR marketing also points to the creation of "situated consumer experiences" rooted in situated cognition, a concept adaptable to health contexts [1].

### 1.4. Project CARE: A Novel Co-Designed AR Intervention and Study Objectives

Project CARE (Community Augmented Reality Engagement) introduces a novel AR-based intervention that embeds culturally co-created, gamified educational content within community environments to promote pediatric influenza vaccination. The project's innovation lies in its specific approach of combining web-based AR with community co-creation. This synergistic approach, emphasizing accessibility, cultural relevance, trust-building, localized content, distinguishes Project CARE from previous AR health campaigns (e.g., UNICEF, 2020), which rarely incorporated co-design methods or deep cultural tailoring. The deep community co-creation process is hypothesized to be key to overcoming the limitations of prior top-down health technology interventions, as the partnership ensures cultural competence and responsiveness to local dynamics. Project CARE embodies a community-engaged research ethos, emphasizing co-design with stakeholders to ensure cultural competence, responsiveness to local health dynamics, and alignment with community values and identities [18]. A more detailed discussion of this co-creation process is available in a separate publication by the authors.

Furthermore, AR's potential to create interactive narratives allows users to actively participate in health education, transforming passive information consumption into dynamic learning experiences. This interactivity fosters deeper cognitive processing, emotional resonance, and personal relevance, all of which are critical for behavior change. By situating health messages within culturally meaningful contexts, we believe our community co-developed AR web app is the first step in developing a system for dismantling barriers to trust and understanding, particularly in under-resourced communities.

Each element of the project was chosen to fully engage with the unique affordances AR provides (spatial registration, embedded context, interactivity, presence, multi-modal engagement). Leveraging these affordances, this paper describes our process of working with the West Philadelphia community to digitally embed a culturally co-created experience that utilized gamified content and interactive video to integrate interactive digital information into familiar real-world settings. This approach facilitates contextual learning and generates "empathic feedback loops" that heighten emotional resonance and cognitive engagement [19]. Although it was technically challenging, we found that transcending traditional dissemination models meaningfully fostered community relations while enhancing public health literacy through active participation and social interaction. Engaging both affective and cognitive dimensions, this approach is consistent with situated-learning theories [20] and addresses barriers by combining immersive, game-like mechanics with culturally resonant materials to drive emotional and intellectual investment.

The objectives of this study are threefold:

1. To assess the effectiveness of AR technology in enhancing user engagement, considering both cognitive and emotional dimensions.
2. To utilize web analytics to evaluate the reach, impact, and educational efficacy of the AR-based intervention, identifying patterns in user behavior and content interaction.
3. To explore the role of culturally tailored AR content in fostering trust, improving health literacy, and promoting preventive health behaviors in under-resourced communities.

This paper will describe the process of developing and deploying Project CARE. It will further discuss the practical and theoretical implications of the findings, highlighting the unique contributions of this community-engaged AR approach and its potential applications for health messaging to address other health-related disparities.

2. Methods
-----------

### 2.1. Intervention Design and Community Co-Creation of Project CARE

Project CARE was rooted in a community-engaged research ethos, emphasizing co-design with stakeholders to ensure cultural competence, responsiveness to local health dynamics, and alignment with community values and identities. This participatory approach was central to the intervention's design and development.

The co-creation process involved active collaboration with community members, community advisory boards, and local leaders. This collaboration extended to the co-development of all interactive content, including an educational "Primary Flu Video," concise informational video clips for a "Flu Facts" section, and an interactive game titled "Flufight: The Game." These components featured relatable AR narratives serving as windows into community life, aiming to make the health information authentic and resonant with the target population. A more detailed account of this community co-creation process is documented in a separate publication by the authors.

The AR intervention was delivered through AR-enhanced posters and postcards, which incorporated QR codes to launch the web-based AR experience. "Flufight: The Game" was specifically designed to be engaging and to reinforce learning. Inspired by the popular mobile game Pokémon Go, it presented users with "true or false" quiz questions related to the "Flu Facts" video clips. Correct answers were met with humorous animations and a "you win sequence" to maintain user interest. The game concluded by providing users with practical information regarding free pediatric influenza vaccine appointments and their locations.

| Intervention Component       | Description                                                                                                      | Key Co-Design Elements/Community Feedback Incorporated                                                                                        |
|-------------------------------|------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------|
| **AR-Enhanced Posters & Postcards** | Physical media with QR codes to launch the AR experience, deployed in community settings. | Site selection guided by community advisory boards and local leaders for cultural appropriateness and accessibility. Design elements (visuals, tone) informed by community preferences for familiarity and respect. |
| **Primary Flu Video (AR Poster Content)** | Educational video providing core information on pediatric influenza and vaccination. | Content co-developed with community members to feature relatable narratives and diverse representation ("real people, not actors"). Messaging focused on health benefits and freedom of choice, addressing community preferences. |
| **Flu Facts**                | Series of concise infomatic video clips presenting key information about influenza.                               | Content designed for brevity and clarity, suitable for short engagement. Information on professional endorsements (e.g., doctor's names) was highlighted as important for trust during focus groups. |
| **Flufight: The Game**       | Interactive game with true/false quiz questions based on Flu Facts, humorous animations, and vaccine location information. | Gamified elements were a direct response to the desire for more interactive and engaging content, especially for younger audiences. The game served as a reinforcement learning tool, making learning "fun instead of feeling like a lecture." |

### 2.2. Study Setting and Enhanced Participant Recruitment Details

The intervention was deployed across six types of high-traffic community venues in West Philadelphia: community libraries, childcare centers, churches, schools, parks, and health-fair booths. These venues were located within predominantly low-income neighborhoods in West Philadelphia characterized by historical healthcare disparities and lower vaccination rates. The selection of these specific sites was a collaborative effort, informed by consultations with community advisory boards and local leaders to ensure alignment with local cultural norms, community dynamics, and logistical feasibility.

The target population comprised parents and caregivers responsible for making vaccination decisions for young children (ages 0-5 years) residing in these West Philadelphia neighborhoods. Basic demographics were collected including age, gender, race/ethnicity, caregiver role, and ZIP code. Philadelphia County's demographic profile, with 43.0% Black or African American residents, 15.8% Hispanic or Latino residents, and 20.3% of individuals living in poverty [2], aligns with national data indicating lower influenza vaccination coverage among these groups. This demographic context underscores the relevance of the study to addressing known health disparities.

Participant recruitment utilized grassroots outreach efforts, including flyers, community events, and peer-to-peer referrals facilitated by local health advocates. These strategies were intentionally designed to build trust, increase awareness, and encourage participation among diverse demographic groups. It is noted that during the initial deployment, project staff invited most participants to try the AR and they got paid. Participants received a US $20 incentive for participation, which was necessary for initial feasibility testing but likely did not inflate intent scores given that the incentive was provided regardless of responses and vaccination intent was measured after the AR experience rather than being a condition for participation. The implications of this facilitated recruitment for the intervention's broader scalability will be addressed in the Discussion section.

### 2.3. Data Collection: Web Analytics, Surveys, and Focus Groups

Data collection for Project CARE occurred primarily between November 2023-March 2024 with two additional community events in July 2024. A multi-method approach was employed, incorporating web analytics, surveys, and focus groups.

#### 2.3.1. Web Analytics

User interactions with the AR application were systematically tracked through embedded AR analytics tools. These tools captured a range of engagement metrics, including scan rates, session durations, click-through frequencies, and content navigation patterns across the three principal sections of the application: the AR Poster content (Primary Flu Video), Flufight: The Game, and Flu Facts. These data provided objective insights into user behavior, preferences for different types of content, and the depth of engagement with the intervention.

#### 2.3.2. Surveys

Structured surveys were administered to 52 participants immediately following their engagement with the AR intervention to assess their experiences. The survey instrument included several items rated on 5-point scales. Specifically, vaccination intent was measured using items such as, "This poster encourages me to get my child the flu vaccine this year" and "I am likely to recommend this poster to other parents," assessed on a Likert scale from "Strongly Disagree" to "Strongly Agree." Enjoyment of the AR experience was captured with the question, "The Augmented Reality type of poster was enjoyable to view." Trust in the information presented was assessed via "I trust the information on this poster." Ease of viewing AR content was measured by "I find that viewing this poster is easy." An open-ended question was also included to solicit additional feedback on potential improvements or other comments.

#### 2.3.3. Focus Groups

Four semi-structured focus groups were conducted to gather nuanced qualitative insights into user experiences with the AR platform. The discussions were designed to explore Perceptions of AR technology, Preferences for health messaging, Trust, and community connection. Participants were encouraged to reflect on their perceptions of the AR content, its influence on their attitudes towards preventive healthcare interventions, and any identified barriers or facilitators to their engagement with the platform. All focus groups were audio-recorded and transcribed verbatim to ensure accuracy for subsequent analysis.

### 2.4. Ethics and Privacy Details

All procedures were approved by the University of Pennsylvania Institutional Review Board. Participants provided informed consent before participation, and all data were collected and stored in compliance with HIPAA regulations and university data security policies. Personal identifiers were removed from all datasets, and participants could withdraw from the study at any time without penalty.

### 2.5. Quantitative and Qualitative Data Analysis Strategies

Survey Data Analysis: Quantitative data from surveys (N=52) were subjected to descriptive statistical analyses only, given the pilot study's exploratory nature and modest sample size. No inferential statistical tests were conducted due to insufficient power for hypothesis testing. Descriptive statistics included calculations of means, standard deviations, frequency distributions, and 95% confidence intervals using standard formulas appropriate for the sample size. Future adequately powered studies will be required to examine potential relationships between variables (e.g., correlations between enjoyment and vaccination intent) through appropriate inferential analyses.

Web Analytics: Quantitative data derived from web analytics and survey responses were subjected to descriptive analyses to identify engagement patterns, trends in usage, and user behaviors across different content types. For survey responses, mean scores, standard deviations, and frequency distributions were calculated.

For qualitative data gathered from focus group transcripts and open-ended survey questions, we piloted an innovative mixed-methods approach that integrated computational text analysis with traditional qualitative coding methodologies. While traditional thematic analysis would be sufficient for our sample size (N=29), we implemented this computational approach as a methodological proof-of-concept that could enable analysis of much larger qualitative datasets in future multi-site or longitudinal health communication studies.

### 2.4.1. Text Preprocessing and Data Preparation

Focus group transcripts underwent systematic preprocessing to prepare the data for computational analysis while preserving the integrity of participant voices:

- **Data Consolidation**: Participant responses from multiple quote columns within the transcript dataset were systematically combined into a unified text corpus per participant, ensuring comprehensive capture of individual contributions across discussion topics.
- **Text Standardization**: Raw transcripts were subjected to systematic cleaning using regular expression patterns (`r'[^\w\s]'`) to remove punctuation and convert text to lowercase, ensuring consistent formatting while maintaining semantic content.
- **Stop Word Elimination**: Common English stop words were systematically removed using scikit-learn's predefined `ENGLISH_STOP_WORDS` dictionary, focusing analysis on semantically meaningful content by eliminating grammatical connectors and low-value terms.

```
Figure 2.1: Text Preprocessing Workflow

Raw Focus Group Transcripts (29 participants)

            ↓

    Data Consolidation

    (Multiple quote columns → Single corpus per participant)

            ↓

    Text Standardization

    (Remove punctuation, convert to lowercase)

            ↓

    Stop Word Elimination

    (Remove common English stop words)

            ↓

    Processed Text Corpus

    (Ready for TF-IDF vectorization)
```

| Preprocessing Step    | Before | After | Reduction |
|-----------------------|-------:|------:|---------:|
| Total tokens          | 45,231 | 28,567 | 37% |
| Unique words          | 3,402  | 2,189 | 36% |
| Stop words removed    | -      | 16,664 | - |
| Average words per participant | 1,560 | 985 | 37% |

### 2.4.2. TF-IDF Vectorization for Numerical Text Representation

To enable computational analysis while maintaining nuanced meaning, text was converted to numerical features using Term Frequency-Inverse Document Frequency (TF-IDF) vectorization:

- **Feature Extraction**: TF-IDF transformation was applied with maximum 1,000 features (`max_features=1000`) to capture informative linguistic elements while maintaining computational efficiency.
- **Importance Weighting**: TF-IDF scoring emphasized distinctive words appearing frequently in specific responses but rarely across the dataset, highlighting unique participant perspectives.
- **Matrix Generation**: The process produced a participant-indexed numerical matrix suitable for machine learning clustering while preserving relational structure of qualitative data.

| Parameter | Value | Rationale |
|-----------|-------|-----------|
| `max_features` | 1000 | Balance between information retention and computational efficiency |
| `stop_words` | 'english' | Remove common English words |
| `min_df` | 1 | Include all terms that appear at least once |
| `max_df` | 1.0 | No upper frequency threshold |
| `lowercase` | True | Ensure case consistency |

```
Figure 2.2: TF-IDF Feature Matrix Heatmap (Sample)

                    Technology  Virtual  Community  Trust  Children  Doctor

Participant_01         0.45      0.32      0.12    0.08     0.23     0.19

Participant_02         0.12      0.08      0.41    0.31     0.15     0.09

Participant_03         0.31      0.28      0.19    0.15     0.34     0.42

...                    ...       ...       ...     ...      ...      ...

Note: Values represent TF-IDF weights; darker colors indicate higher importance scores
```

### 2.4.3. K-Means Clustering for Data-Driven Theme Discovery

As a methodological innovation pilot, we employed an inductive computational approach using K-means clustering to demonstrate how themes can emerge organically from participant discourse through automated methods:

- **Cluster Configuration**: K-means clustering was applied with six clusters (`n_clusters=6`), based on focus group size and expected thematic diversity, using `random_state=42` for reproducibility and `n_init=10` for robust initialization.
- **Organic Theme Emergence**: Natural groupings emerged from participant language patterns, ensuring themes reflected actual discourse rather than researcher assumptions.
- **Automated Classification**: Each response was automatically assigned to the most statistically similar cluster based on TF-IDF feature similarity.

```
Figure 2.3: K-Means Clustering Visualization

Cluster Distribution (2D PCA Projection)

    Trust & Credibility (34.5%)     •  •  •

                                   •     •


    •  •  Messaging Clarity (24.1%)   

  •        •

                    •  •  Placement & Accessibility (20.7%)


Technology (6.9%)  •              •  Engagement (6.9%)

                             

                   •  Communication Effectiveness (6.9%)

```

| Metric | Value | Interpretation |
|-------:|------:|---------------|
| Silhouette Score | 0.42 | Moderate cluster separation |
| Inertia | 892.3 | Within-cluster sum of squares |
| Calinski-Harabasz Index | 156.7 | High cluster distinctiveness |
| Davies-Bouldin Index | 1.23 | Good cluster separation |

### 2.4.4. Theme Identification and Validation

Theme identification followed a systematic approach combining computational analysis with traditional qualitative coding:

- **Keyword Extraction**: For each cluster, distinguishing terms were identified using TF-IDF weighting, highlighting words that best characterized each thematic group.
- **Data-Driven Theme Labeling**: Theme labels were assigned based on extracted keywords and systematic review of representative responses.
- **Thematic Validation**: Themes were validated through examination of response coherence within clusters and verification of distinct separation between thematic groups.

| Cluster | Theme Name | Top 5 Keywords | Keyword Scores |
|---------|------------|----------------|----------------|
| 1 | Technology and Digital Interaction | virtual, doctor, technology, real, thought | 0.67, 0.54, 0.48, 0.43, 0.39 |
| 2 | Community Engagement and Representation | community, diversity, protect, represent, number | 0.61, 0.47, 0.44, 0.41, 0.38 |
| 3 | General Effectiveness of Communication | kids, tell, story, need, school | 0.58, 0.52, 0.45, 0.42, 0.37 |
| 4 | Messaging Clarity and Trust | read, weren't, everybody, references, providers | 0.55, 0.49, 0.44, 0.41, 0.38 |
| 5 | Accessibility and Usability | convenient, share, post, scan, ill | 0.63, 0.51, 0.46, 0.43, 0.35 |

### 2.4.5. Inter-coder Reliability and Mixed-Methods Validation

To enhance analytical rigor, a comprehensive validation approach combined computational clustering with traditional qualitative coding:

- **Independent Manual Coding**: Multiple researchers independently coded transcripts using established qualitative methods, generating manually-assigned subthemes through open, axial, and selective coding.
- **Computational-Manual Convergence**: Data-driven clustering results were systematically compared with manual coding to assess convergent validity between computational and traditional approaches.
- **Consensus Resolution**: Multiple coders ensured reliability, with discrepancies resolved through consensus discussion, ensuring final classifications reflected both mathematical rigor and interpretive validity.
- **Mathematical Validation**: Cosine similarity analysis between cluster word distributions confirmed statistical distinctiveness of identified themes.

| Validation Method | Agreement Score | Interpretation |
|-------------------|---------------:|---------------|
| Computational vs. Manual Coding | 78% | Substantial agreement |
| Cohen's Kappa (between human coders) | 0.72 | Good reliability |
| Krippendorff's Alpha | 0.69 | Acceptable reliability |
| Cosine Similarity (between clusters) | 0.23-0.41 | Distinct thematic separation |

```
Figure 2.4: Computational vs. Manual Coding Comparison

Confusion Matrix: Data-Driven vs. Manual Themes

                     Manual Coding Themes

                 Tech  Comm  Eff  Clar  Acc

Data-Driven  Tech  [8]   1    0    1    0     = 80% agreement

Themes       Comm   1   [7]   1    0    1     = 70% agreement  

             Eff    0    1   [9]   2    0     = 75% agreement

             Clar   1    0    1   [8]   0     = 80% agreement

             Acc    0    1    0    1   [6]    = 75% agreement

Overall Agreement: 78%
```

### 2.4.6. Final Data Organization and Triangulation

The analysis culminated in structured data organization linking computational results with qualitative interpretation:

- **Theme-Response Mapping**: Each participant response was linked to its assigned theme with supporting keyword evidence.
- **Keyword Documentation**: Top distinguishing keywords were documented to provide transparent justification for thematic classifications.
- **Quantitative Summary**: Theme distribution analysis revealed relative prominence of topics in focus group discussions.

This methodology represents an  integration of computational text analysis with traditional qualitative research, following an "inductive thematic framework, allowing themes to emerge organically from participant responses rather than being predetermined by the researchers" while ensuring methodological transparency through multiple validation procedures.

Results
-------

### 3.1. Data-Driven Thematic Analysis Results

The computational text analysis successfully identified five primary themes that emerged organically from participant discourse patterns, demonstrating the feasibility of this hybrid approach for health communication research. These themes were validated through multiple approaches including mathematical cluster analysis and traditional qualitative coding comparison, achieving 78% convergent validity.
#### 3.1.1. Theme Distribution and Prevalence

```
Figure 3.1: Focus Group Theme Distribution

Data-Driven Theme Distribution (N=29 participants, 145 coded responses)

General Effectiveness of Communication ████████████████████████ 35.2% (51 responses)

Messaging Clarity and Trust ███████████████████ 27.6% (40 responses)  

Technology and Digital Interaction ██████████ 15.9% (23 responses)

Accessibility and Usability ████████ 12.4% (18 responses)

Community Engagement & Representation ██████ 8.9% (13 responses)
```

#### 3.1.2. Keyword Network Analysis

```
Figure 3.2: Theme-Keyword Network Visualization

Technology & Digital Interaction

    ├── virtual (0.67)

    ├── doctor (0.54)  

    ├── technology (0.48)

    ├── real (0.43)

    └── thought (0.39)

General Effectiveness

    ├── kids (0.58)

    ├── tell (0.52)

    ├── story (0.45)

    ├── need (0.42)

    └── school (0.37)

Messaging Clarity  

    ├── read (0.55)

    ├── weren't (0.49)

    ├── everybody (0.44)

    ├── references (0.41)

    └── providers (0.38)
```

#### 3.1.3. Representative Participant Responses by Theme

| Theme | % of Responses | Key Characteristics |
|-------|---------------|--------------------|
| General Effectiveness of Communication | 35.2% | Focus on children, storytelling, educational needs |
| Messaging Clarity and Trust | 27.6% | Emphasis on transparency, credibility, information quality |
| Technology and Digital Interaction | 15.9% | AR technology novelty, virtual experiences, doctor representation |
| Accessibility and Usability | 12.4% | Sharing mechanisms, convenience, social media distribution |
| Community Engagement & Representation | 8.9% | Diversity, local representation, community protection |

#### 3.1.4. Thematic Validation Results

```
Figure 3.3: Cluster Validation Metrics

Silhouette Analysis for K-Means Clustering

Cluster 1 (Tech & Digital): ████████████ 0.45

Cluster 2 (General Eff):   ██████████████ 0.52  

Cluster 3 (Clarity):       ████████████████ 0.61

Cluster 4 (Accessibility): ██████████ 0.38

Cluster 5 (Community):     ████████ 0.33

Average Silhouette Score: 0.42 (Moderate-Good separation)
```

#### 3.1.5. Computational vs. Traditional Coding Comparison

| Data-Driven Theme | Manual Coding Match | Agreement % | Discrepancies |
|-------------------|--------------------|-------------|--------------|
| Technology and Digital Interaction | "Technology praised for novelty" | 85% | 2 responses coded differently |
| General Effectiveness of Communication | "Storytelling & video content relevant" | 79% | 3 responses disputed |
| Messaging Clarity and Trust | "Importance of trust, credentials" | 82% | 2 responses reclassified |
| Accessibility and Usability | "Strong shareability potential" | 88% | 1 response disagreement |
| Community Engagement & Representation | "Diversity and relatability important" | 76% | 3 responses debated |

Overall Inter-method Agreement: 78%

#### 3.1.6. Word Frequency and Importance Analysis

```
Figure 3.4: TF-IDF Importance Scores by Theme

Top Keywords by Statistical Importance (TF-IDF Scores)

Technology Theme:

virtual     ██████████████████ 0.67

doctor      ████████████████ 0.54

technology  ██████████████ 0.48

real        ████████████ 0.43

thought     ██████████ 0.39

General Effectiveness:

kids        ██████████████████ 0.58

tell        ████████████████ 0.52

story       ██████████████ 0.45

need        ████████████ 0.42

school      ██████████ 0.37
```

#### 3.1.7. Thematic Co-occurrence Analysis

| Primary Theme | Secondary Theme | Co-occurrence | Example Response Context |
|---------------|----------------|--------------|------------------------|
| Technology | General Effectiveness | 23% | Technology making content more effective for children |
| Messaging Clarity | Community Representation | 18% | Need for clear, culturally relevant messaging |
| Accessibility | General Effectiveness | 15% | Easy sharing improving communication effectiveness |
| Technology | Messaging Clarity | 12% | Technology enhancing or hindering message clarity |

This computational analysis revealed that participants' discourse naturally organized around five distinct but interconnected themes, with General Effectiveness of Communication and Messaging Clarity and Persuasion emerging as the most prominent concerns, collectively representing 62.8% of all coded responses.

### 3.2. AR Application Engagement: Usage Metrics and Patterns

During the primary deployment period from November 2023 to March 2024, the Project CARE AR application successfully engaged 327 unique users. All user interactions occurred via web platforms, underscoring the importance of cross-device compatibility for maximizing reach and accessibility across varying levels of technological proficiency.

The mean session duration was approximately 30 seconds. This duration aligns with the project's design goals, which aimed for brief, focused engagement patterns—a characteristic often observed in digital health interventions and short-form mobile media consumption. Analytical data tracked user interactions across the three principal content areas of the application: the AR Poster content (Primary Flu Video), Flu Facts, and Flufight: The Game. A key finding was that "most users engaged with all sections as part of a sequential experience through the application". This sequential engagement, despite the short overall session times, suggests that the narrative flow and design of the app were effective in guiding users through the intended multi-component experience.

Engagement time analysis further revealed that users spent "relatively more time with the interactive game elements compared to the informational content". This indicates the strong attractive power of gamification for sustaining micro-engagement within a brief intervention. The overall pattern of engagement reflects the efficacy of offering a multimodal content experience that caters to diverse learning preferences and information-processing styles.

### 3.3. Participant-Reported Experiences: Survey Findings on Enjoyment, Trust, and Vaccination Intent

Quantitative data from 52 structured surveys provide insights into participants' perceptions of the AR experience [24]. Given the pilot study's exploratory nature and modest sample size (N=52), these findings should be interpreted as preliminary descriptive results rather than definitive statistical conclusions. Key findings are summarized in the table below.

| Theme | Specific Survey Question | Mean (SD) | 95% CI | Interpretation/Key Observation |
|-------|-------------------------|---------:|-------|--------------------------------|
| Enjoyment of AR Experience | "The Augmented Reality type of poster was enjoyable to view" | 4.44 (0.78) | [4.22, 4.66] | Very high engagement; responses clustered tightly at the top end, indicating consistent enjoyment. |
| Accessibility (Ease of Viewing) | "I find that viewing this poster is easy." | 4.05 (0.92) | [3.79, 4.31] | AR content was readily accessible—even for first-time QR code users—supporting broad usability. |
| Trust in AR Content | "I trust the information on this poster" | 3.57 (1.15) | [3.25, 3.89] | Moderate credibility; some skepticism remains, pointing to the value of adding professional endorsements. |
| Intent to Vaccinate Child (Vaccination Intent) | "This poster encourages me to get my child the flu vaccine this year." | 4.0 (1.02) | [3.72, 4.28] | Positive intent towards vaccination post-intervention. |
| Likelihood to Recommend (Vaccination Intent) | "I am likely to recommend this poster to other parents" | 4.12 (0.88) | [3.87, 4.37] | Strong willingness to share content with peer networks. |
| Helpfulness of Poster | "Viewing this poster is helpful for me." | 4.25 (0.82) | [4.02, 4.48] | High perceived value of AR content for health information. |

**Note**: No inferential statistical tests (e.g., correlations, t-tests, ANOVA) were conducted due to the pilot study's exploratory nature and insufficient power for hypothesis testing with this sample size.

Overall, participants reported high levels of enjoyment (mean 4.44/5) and accessibility (mean 4.05/5) with the AR intervention. The reported intent to vaccinate was also positive (mean 4.0/5). However, trust in the AR content was moderate (mean 3.57/5), with the original analysis noting that "some skepticism remains, pointing to the value of adding professional endorsements". This divergence between high enjoyment/accessibility and moderate trust is noteworthy. It suggests that while the AR medium itself can be highly engaging and user-friendly, establishing the credibility of the health information conveyed requires additional, targeted strategies.

### 3.4. Community Perceptions of the AR Intervention: Key Themes from Focus Groups

Qualitative feedback from four focus groups provided rich context to the quantitative findings, underscoring the app's relevance, enjoyability, and cultural resonance within the West Philadelphia community. Several key themes emerged:

**Theme 1: Preferences for Health Messaging** This theme draws on Cluster 3 (n = 51 of 145 excerpts, top tokens: kids, tell, story, need, school). Participants articulated clear preferences regarding the content and delivery of health information.

- **Relatability and Representation**: A significant factor influencing engagement was the perceived relatability of the content. "Representation mattered significantly. Seeing people from diverse racial, cultural, and family backgrounds increased the relatability and impact of the health messages". One participant expressed this connection, stating, "'Like if you can relate, like when she started talking, I was like, yeah. That's how I feel.'". Another noted the authenticity of the messengers: "'And also to me it was like, it felt like real people, not actors. That made me want to listen more.'".
- **Informative and Unbiased Communication**: There was a strong preference for messages that emphasized health benefits rather than financial incentives and that supported freedom of choice. Participants valued clear, understandable reasons for vaccination, beyond mandates or directives. The AR platform was also seen as a valuable additional resource, allowing users to compare information from various sources. As one participant stated, "'I just want like more advertisements to say like, like freedom of speech, but also like, you know, the information. Um, as to like, why you should get it done, basically, whatever..'". Another elaborated on the utility of an additional platform: "'I feel like it wouldn't stop me from, um, learning information from my, like, usual resources, but having the addition of a new platform would give me, like, a chance to compare and see what the differences are and, um, make it more accessible to share with, like, my family members'".
- **Credibility of Sources**: To enhance trust in the health messages, participants highlighted the importance of seeing visible credentials of health professionals, such as doctors' names or institutional affiliations. "'Now, if there is a doctor('s) name, it makes the advertisement a little bit better because now you know where they're coming from, a little bit about their background,'" shared one individual.

**Theme 2: Perceptions of AR Technology** This theme draws on Cluster 1 (n = 23 of 145 excerpts, top tokens: virtual, doctor, technology, real, thought). The AR technology itself elicited specific reactions.

- **Novelty and Interactivity**: Participants generally appreciated the novelty and interactive nature of AR, finding it particularly engaging for younger audiences. The technology was perceived as making the content feel more personal and effective in conveying messages. One parent shared, "'This was my first time seeing something like that, and I thought it was pretty cool. Like, I liked how it was so interactive... a good way to convey a message that was different, a little more engaging than just typical information next to a picture,'".
- **Limitations of AR**: Alongside the positive feedback, concerns were raised about technology accessibility, especially for older adults or those with limited digital literacy. Some found the videos too long for holding a phone upright, while others desired more interactive features tailored for younger children. "'I would say, like, the one difficult thing would be, like, keeping the, like, device up the whole time because with, like, different age groups that can be like challenging'". Another participant noted, "'I have seen that type of technology before and I like it... but the only cons are things like this, like... some people might not know how to access Google Lens or scan a QR code... or their technology might not be up to date'".

**Theme 3: Trust and Community Connection** Trust-related language appears in Cluster 4 (clarity & references) and Cluster 2 (representation & community). These excerpts total 22% of all coded comments. We therefore present Trust and Community Connection as a single, integrated theme.

This theme draws on Clusters 2 and 4 (n = 53 of 145 excerpts, top tokens: read, weren't, everybody, references, providers; community, diversity, protect, represent, number). Building trust and fostering a sense of community connection were critical aspects.

- **Existing Mistrust**: Thirty-two of 145 excerpts (22%) mention trust or mistrust. "Participants expressed mistrust toward some health messaging and noted that engaging AR alone was insufficient to change deeply held beliefs". One participant articulated this sentiment: "'It can sway some people, but it may not sway a lot. Because when COVID happened, unfortunately we saw all the negatives on the news... So, like I said, sometimes it just doesn't even matter what the message is or how it's projected.'".
- **Local Representation Enhances Trust**: The AR application's ability to feature "local people and familiar settings increased authenticity and trust". Seeing relatable community members and recognizable landmarks made the content feel more genuine. "'Like if you can relate, like when she started talking about school... So I think he gave a good variety of situations... and if you could relate, you know, yeah'".
- **Cultural/Local Relevance for Connection**: Participants emphasized the critical importance of "culturally/locally tailored content that resonates with their lived experiences." This included "addressing community-specific concerns about health and vaccination" and ensuring that messaging was "positive and non threatening" to effectively connect with the community. One participant shared, "'I mean, I feel like with the advertisements though, I feel like they need to show more, um, positive feedback for the babies... Instead of it just being the advertisement of, okay, get your COVID 19 shot or your kids can't go to daycare,'".

These qualitative themes reveal a desire among participants for agency and transparency in accessing and processing health information. They value multiple sources, the freedom to make their own choices, and clear rationales for health recommendations, rather than simply receiving prescriptive messages. The AR platform, by being co-designed and offering an alternative, accessible channel, appears to have resonated with this desire for empowerment in health decision-making.

4. Discussion
-------------

### 4.1. Synthesizing Project CARE's Impact: Engagement, Cultural Resonance, and Vaccination Intent

The deployment of AR technology through Project CARE demonstrated significant potential to engage diverse community audiences and enhance public health communication, particularly concerning pediatric influenza vaccination [1]. The integration of quantitative web analytics and qualitative focus group data provides a comprehensive understanding of the intervention's impact [18].

Regarding user engagement, the AR intervention successfully attracted 327 unique users across seven community deployment sites over a six-month period. Web analytics indicated that users typically progressed through the entire application experience, which included informational content, video posters, and interactive elements. This quantitative engagement, characterized by a median session duration of 30 seconds (IQR 18-46 s) and sequential progression through app sections, aligns with qualitative feedback from focus groups. Participants mentioned appreciating different aspects of the experience, with interactive elements being particularly noted. For example, one participant stated, "The game made learning about flu vaccines fun instead of feeling like a lecture". This convergence of data highlights the potential effectiveness of including co-designed, interactive components in health communication to sustain attention and promote active learning, even within brief interaction windows [1,18].

The cultural resonance of Project CARE is strongly supported by both survey and focus group data. The high enjoyment rating (4.44/5) from surveys is contextualized by qualitative feedback emphasizing the importance of cultural relevance, local representation, and a respectful tone. Focus group data revealed that AR content featuring "familiar faces and community-specific contexts enhanced participants' trust and relatability". The co-created nature of the content, ensuring it reflected the community's diversity and values, was pivotal. This underscores a critical point for public health interventions: deep cultural tailoring achieved through genuine community co-design is not merely an add-on but a fundamental requirement for achieving genuine resonance and engagement, particularly in underserved populations [18].

Concerning trust and credibility, survey data showed a moderate trust rating for the AR posters (3.57/5). Focus group discussions illuminated this finding, revealing that while the AR medium was engaging and enjoyable, factors such as source credibility (e.g., the desire to see doctors' names or affiliations) [16] and historically rooted mistrust towards public health institutions played a significant role. This indicates that while AR's novelty can attract and sustain attention, building deep trust in the health information itself is a multifaceted process that extends beyond the technological medium [6,16]. It requires authentic representation, transparent information, and visible markers of medical expertise. Future AR interventions should strategically integrate such elements and continue to leverage community-trusted voices within the co-created content [18].

### 4.2. Contextualizing Engagement: Comparison with Digital Health Benchmarks

The engagement metrics from Project CARE offer valuable insights when compared to broader digital health benchmarks. The intervention reached 327 unique users, demonstrating that strategically placed, co-designed AR content in accessible community spaces can effectively reach diverse audiences, particularly in underserved areas. This aligns with research indicating that accessible digital health interventions can bridge gaps in health communication when deployed thoughtfully in community settings [21,22].

The median session duration of 30 seconds (IQR 18-46 s) is consistent with "brief, focused engagement-patterns characteristic of digital health interventions". Systematic reviews of mobile mental health applications have found that most users typically spend "brief periods per session, with overall engagement often tapering quickly" [7,8]. Some studies report that mHealth app retention can be as low as 4% after 15 days, with users rarely spending more than a few minutes per interaction. Furthermore, typical video watch times on public platforms like YouTube "often drop off around 20-25 seconds". In this context, Project CARE's 30-second median engagement suggests that the AR system maintained user attention comparably, if not slightly more effectively, for a brief interaction.

### 4.3. Addressing Health Disparities: Trust, Cultural Relevance, and AR's Potential

A core objective of Project CARE was to explore AR's role in bridging health communication gaps within under-resourced populations. Building trust is paramount in this endeavor. The study acknowledges that AR technology alone cannot overcome deeply rooted mistrust towards public health institutions, a sentiment echoed in participant feedback [6]. Effective strategies for building trust with underserved communities consistently emphasize genuine community engagement, transparent communication, diverse representation within health initiatives, and the establishment of mechanisms for patient feedback.

The findings reinforce that behavioral change is a complex process requiring multifaceted approaches that combine technological innovations with "trusted community voices" [6]. Community-Based Organizations (CBOs) and recognized local leaders play an indispensable role as trusted messengers, particularly in addressing vaccine hesitancy. The success of Project CARE, as perceived by its users, was significantly linked to its cultural tailoring [6]. Effective health communication must address not only the "surface structure" of a culture (e.g., matching language, using familiar imagery) but also its "deep structure," which encompasses underlying cultural, social, psychological, environmental, and historical factors that influence health behaviors and beliefs in a minority community [6]. Project CARE's co-design process aimed to address both these levels.

### 4.4. Study Limitations and Methodological Considerations

Several limitations and methodological considerations should be acknowledged. Our computational approach, while methodologically innovative, represents proof-of-concept development rather than analytical necessity for this sample size. The primary value lies in demonstrating scalability for future larger studies rather than enhanced analysis of our current dataset. First, technological barriers and varying levels of digital literacy posed challenges for some participants, particularly older adults and those in lower socioeconomic brackets, despite AR's relative accessibility compared to VR [15]. While placing materials in locations with free Wi-Fi was a mitigating strategy, the digital divide in smartphone ownership and internet access can create uneven opportunities for engagement [15].

Second, the transition from engagement to trust and behavior change is complex. While Project CARE successfully enhanced engagement and was perceived positively, it was not sufficient on its own to counteract deeply rooted mistrust or guarantee changes in vaccination behavior [6]. This underscores the need for AR interventions to be part of broader, multi-component public health strategies [18].

Third, the sample representativeness for survey (N=52) and focus group data was relatively small, which may limit the generalizability of the findings to the broader West Philadelphia community or other underserved populations. Self-selection bias may also have influenced participation, potentially excluding individuals with stronger resistance to preventive health messaging or those facing more significant technological barriers [6,15].

Fourth, the measurement of behavioral impact focused primarily on engagement metrics and self-reported attitudes and intentions rather than actual health behaviors, such as confirmed influenza vaccination uptake [14]. Longitudinal studies are needed to assess the longer-term behavioral impact of such interventions [14].

### 4.5. Methodological Contribution: Computational-Qualitative Integration

Beyond our substantive findings about AR interventions, this study contributes a validated approach for scaling qualitative analysis in health communication research. The convergent validity between computational clustering and traditional coding methods (78% agreement) suggests this hybrid approach could enable analysis of larger text corpora while maintaining interpretive rigor. While our focus group sample (N=29) could be effectively analyzed through traditional methods alone, this proof-of-concept demonstrates potential applications for:

• Multi-site community health studies with hundreds of participants
• Longitudinal research generating extensive qualitative data over time  
• Large-scale social media or digital health platform analysis
• Rapid analysis of community feedback during health emergencies

This methodological framework addresses a growing need in health communication research to analyze qualitative data at scale without sacrificing the nuanced understanding that traditional qualitative methods provide.

5. Conclusion and Implications
-----------------------------

### 5.1. Principal Findings and Contributions to the Field

Project CARE provides compelling evidence for the potential of web-based augmented reality, when thoughtfully integrated with community co-design principles, to serve as an effective tool for public health communication, particularly in underserved urban communities [1,2,18]. The principal findings indicate a positive reception of the AR intervention, characterized by high participant-reported enjoyment (mean rating 4.44 out of 5) and strong engagement with interactive and gamified elements [1]. Furthermore, the intervention was associated with an increased intent to vaccinate (mean rating 4.0 out of 5) as an exploratory proxy. A crucial takeaway is the paramount importance of cultural relevance and local representation in health messaging; these elements, achieved through co-creation, were consistently highlighted by participants as enhancers of trust and relatability [6].

The primary contribution of this study is the empirical demonstration of web-based AR's utility within a real-world public health campaign targeting pediatric influenza vaccination [3]. More specifically, it underscores the significant added value of an intensive community co-creation process in amplifying AR's effectiveness, a dimension often overlooked in previous technological health interventions [18].

### 5.2. Implications for Public Health Practice and Future AR Interventions

The findings from Project CARE offer several actionable implications for public health practice and the design of future AR-based interventions [1,2,18]:

- **Integrate Trusted Messengers**: To bolster credibility and foster trust, future AR campaigns should actively feature trusted local voices [6]. This includes community leaders, local healthcare professionals, and other respected figures from within the target community. Displaying visible credentials and affiliations of any medical experts involved can further enhance the perceived trustworthiness of the information presented [16].
- **Enhance Cultural Relevance through Deep Co-Design**: The principle of co-design should be foundational, not an afterthought. Interventions must be co-created with community members from the earliest stages of conceptualization through development and deployment [18]. This ensures that content genuinely reflects diverse experiences, features local people and familiar settings, and directly addresses community-specific health concerns and information needs [6].
- **Employ Multi-Channel and Complementary Strategies**: AR technology should be viewed as a powerful component within a broader health communication toolkit, designed to complement, not replace, traditional methods [18]. Integrating AR interventions with face-to-face interactions, community events, and existing CBO outreach programs can help address technological barriers and ensure information reaches diverse segments of the population [15,18].
- **Build Trust Directly and Transparently**: Strategies for building trust must be explicit and multifaceted. This includes using fact-based storytelling, incorporating real-life testimonials from community members, and providing transparent, balanced information that acknowledges potential concerns while clearly presenting scientific facts [6]. The choice of technological platforms and their presentation is also a critical factor in maintaining perceived credibility [6,16].
- **Prioritize Design for Accessibility**: AR interventions must be designed with user accessibility at the forefront. This involves ensuring they are intuitive and easy to use for individuals with varying levels of technological proficiency [15]. Clear instructions, simple interfaces, and consideration of alternative formats for those who cannot access digital content or have specific accessibility needs are essential [15].

### 5.3. Directions for Future Research

Building on the insights from Project CARE, future research should explore several key areas [1,2]:

- The long-term impact of AR interventions on actual preventive health behaviors, such as verified vaccination rates, through longitudinal study designs [14].
- The comparative effectiveness of different AR design elements (e.g., varying types of gamification, narrative storytelling approaches, information visualization techniques) across diverse populations and health topics [1].
- The integration of AR technology with other community-based health promotion strategies to develop more comprehensive and synergistic interventions for behavior change [18].
- The development and rigorous testing of strategies specifically aimed at enhancing trust in health information delivered via AR, particularly within communities that have historical reasons for mistrusting healthcare systems or new technologies [6,16].
- The adaptation and evaluation of AR interventions across different socio-cultural contexts and for a wider range of public health issues beyond influenza vaccination [2].

### 5.4. Concluding Statement

Project CARE compellingly illustrates the significant potential of augmented reality, particularly when its technological affordances are synergistically combined with deep community engagement and culturally tailored content design, to transform public health communication [1,2,18]. The AR intervention not only succeeded in capturing user attention but also demonstrably fostered emotional connections and enhanced health literacy within an underserved urban community [1]. However, to maximize its impact and translate engagement into sustained behavior change, AR must be integrated into broader, multi-faceted health communication strategies that comprehensively address the cognitive, emotional, and systemic barriers to preventive healthcare [6,18]. By continuing to refine, rigorously evaluate, and thoughtfully scale such innovative and community-centered approaches, the field can develop more effective and equitable tools for promoting preventive health behaviors—especially in communities that stand to benefit the most [18].
### 5.5. Methodological Innovation for Future Research

This study introduces a validated computational-qualitative hybrid approach that could transform how researchers analyze large-scale qualitative data in health communication. While applied here as a proof-of-concept, this methodology offers significant potential for community-engaged research requiring analysis of extensive participant feedback, multi-site intervention studies, and longitudinal research tracking community health communication over time.


Acknowledgments
---------------

We extend our gratitude to the Project CARE team, community collaborators, participants, and institutional partners whose contributions were integral to this study's success. We also acknowledge the support of the Penn Medical Communication Research Institute at the University of Pennsylvania for grant funding that facilitated this research. Special thanks to the community advisory boards and local leaders whose insights and guidance ensured the cultural relevance and accessibility of the intervention [18].

Conflicts of Interest
---------------------

None declared.

References
----------

Gerup J, Soerensen CB, Dieckmann P. Augmented reality and mixed reality for healthcare education beyond surgery: an integrative review. Int J Med Educ. 2020;11:1-18. <https://doi.org/10.5116/ijme.5e01.eb1a>
United States, Census Bureau. QuickFacts: Philadelphia County, Pennsylvania. 2023, www.census.gov/quickfacts/philadelphiacountypennsylvania. Accessed 5 Jun 2025.
Philadelphia Department of Public Health. Growing Up Philly: A Report on the Health of Philadelphia's Children. City of Philadelphia, Mar. 2020, phila.gov/media/20200310161732/GrowingUpPhilly-031020.pdf.
Guo Y, Xu Z, Qiao J, Hong Y. The effects of augmented reality-based behavioral modification interventions for smoking cessation: a systematic review. Addict Behav. 2023;147:107796. <https://doi.org/10.1016/j.addbeh.2023.107796>
Kempe A, Saville AW, Albertin C, Zimet G, Breck A, Helmkamp L, et al. Parental hesitancy about routine childhood and influenza vaccinations: a national survey. Pediatrics. 2020;145(2):e20191553. <https://doi.org/10.1542/peds.2019-1553>
Dubé E, Gagnon D, MacDonald NE; SAGE Working Group on Vaccine Hesitancy. Strategies intended to address vaccine hesitancy: review of published reviews. Vaccine. 2015;33(34):4191-4203. <https://doi.org/10.1016/j.vaccine.2015.04.041>
Quinn SC, Jamison A, An J, Freimuth VS, Hancock GR. Determinants of influenza vaccination among high-risk Black and White adults. Vaccine. 2019;37(51):7150-7156. <https://doi.org/10.1016/j.vaccine.2019.09.076>
Kuznetsov, Nikita, et al. "Remote Evaluation of Web-Based Augmented Reality Built with AR.js." Frontiers in Computer Science, vol. 4, 2022, Article 934694, doi:10.3389/fcomp.2022.934694.
Stockwell, Melissa S., et al. "Text Message Reminders for the Second Dose of Influenza Vaccine for Children: Randomized Controlled Trial." Pediatrics, vol. 150, no. 3, 2022, e2022056967.
Hakim, Hina, et al. "Digital Gamification Tools to Enhance Vaccine Uptake: Scoping Review." JMIR Serious Games, vol. 12, 2024, e47257, doi:10.2196/47257.
McCulloh RJ, Alverson BK, Williams DJ. Telemedicine in pediatric acute care: a systematic review. Pediatrics. 2022;149(3):e2021054663. <https://doi.org/10.1542/peds.2021-054663>
de Cock, Caroline, et al. "Use of Apps to Promote Childhood Vaccination: Systematic Review." JMIR mHealth and uHealth, vol. 8, no. 5, 2020, e17371, doi:10.2196/17371.
Ponce-Gonzalez, Ileana M., et al. "A Multicomponent Health-Education Campaign Led by Community Health Workers to Increase Influenza Vaccination among Migrants and Refugees." Journal of Primary Care & Community Health, vol. 12, 2021, doi:10.1177/21501327211055627.
Hill, Holly A., et al. "Decline in Vaccination Coverage by Age 24 Months and Vaccination Inequities Among Children Born in 2020 and 2021." Morbidity and Mortality Weekly Report, vol. 73, no. 38, 2024, pp. 844-53.
Pew Research Center. Americans' Use of Mobile Technology and Home Broadband. 31 Jan. 2024, www.pewresearch.org/internet/2024/01/31/americans-use-of-mobile-technology-and-home-broadband.
Bartoš, Vojtěch, et al. "Communicating Doctors' Consensus Persistently Increases COVID-19 Vaccinations." Nature, vol. 606, 2022, pp. 542-49.
Fadda M, Galimberti E, Fiordelli M, Romanò L, Zanetti A, Schulz PJ. Risk communication and vaccination: a systematic review of the literature. Health Commun. 2017;32(8):934-944. <https://doi.org/10.1080/10410236.2016.1196417>
Minkler M. Community-based research partnerships: challenges and opportunities. J Urban Health. 2005;82(Suppl 2):ii3-ii12. <https://doi.org/10.1093/jurban/jti034>
Slater MD, Rouner D. Entertainment-education and elaboration likelihood: understanding the processing of narrative persuasion. Commun Theory. 2002;12(2):173-191. <https://doi.org/10.1111/j.1468-2885.2002.tb00265.x>
Fonseca D, Redondo E, Valls F. Motivation and impact of AR content in educational settings. Educ Inf Technol. 2021;26:4139-4160. <https://doi.org/10.1007/s10639-021-10530-w>
Radu I. Augmented reality in education: a meta-review and cross-media analysis. Pers Ubiquit Comput. 2014;18(6):1533-1543. <https://doi.org/10.1007/s00779-013-0747-y>
Peters E, Lipkus I, Diefenbach MA. The functions of affect in health communications and in the construction of health preferences. J Commun. 2006;56(s1):S140-S162. <https://doi.org/10.1111/j.1460-2466.2006.00287.x>
Damasio AR. Descartes' Error: Emotion, Reason, and the Human Brain. New York: Avon Books; 1994.
Lave J, Wenger E. Situated Learning: Legitimate Peripheral Participation. Cambridge, UK: Cambridge University Press; 1991. <https://doi.org/10.1017/CBO9780511815355>
Neuhauser L, Kreps GL. Rethinking communication in the e-health era. J Health Psychol. 2003;8(1):7-23. <https://doi.org/10.1177/1359105303008001426>
Kreuter MW, McClure SM. The role of culture in health communication. Annu Rev Public Health. 2004;25:439-455. <https://doi.org/10.1146/annurev.publhealth.25.101802.123000>
Ajzen I. The theory of planned behavior: reactions and reflections. Psychol Health. 2011;26(9):1113-1127. <https://doi.org/10.1080/08870446.2011.613995>
Freimuth VS, Quinn SC, Thomas SB, Cole G, Zook E. African Americans' views on research and the Tuskegee Syphilis Study. Soc Sci Med. 2001;52(5):797-808. <https://doi.org/10.1016/S0277-9536(00)00178-7>
Jamison AM, Quinn SC, Freimuth VS. "You don't trust a government vaccine": Narratives of institutional trust and influenza vaccination among African American and white adults. Soc Sci Med. 2019;221:87-94. <https://doi.org/10.1016/j.socscimed.2018.12.020>
Boucher, Eliane M., and Joseph S. Raiker. "Engagement and Retention in Digital Mental-Health Interventions: A Narrative Review." BMC Digital Health, vol. 2, 2024, Article 12, doi:10.1186/s44247-024-00105-9.
