import { NextResponse } from "next/server"
import { initializeDatabase, sql } from "@/lib/db"
import bcrypt from "bcryptjs"

export async function POST(request: Request) {
  try {
    // Initialize database tables
    await initializeDatabase()

    // Check if we already have sample data
    const jobsCount = await sql`SELECT COUNT(*) FROM jobs`

    if (Number.parseInt(jobsCount[0].count) === 0) {
      // Create admin user
      const adminPasswordHash = await bcrypt.hash("admin123", 10)
      const adminResult = await sql`
        INSERT INTO users (name, email, password_hash, role)
        VALUES ('Admin User', 'admin@example.com', ${adminPasswordHash}, 'admin')
        RETURNING id
      `

      // Create a demo employer
      const employerPasswordHash = await bcrypt.hash("employer123", 10)
      const employerResult = await sql`
        INSERT INTO users (name, email, password_hash, role)
        VALUES ('Demo Company', 'employer@example.com', ${employerPasswordHash}, 'employer')
        RETURNING id
      `

      const employerId = employerResult[0].id

      // Create company for the employer
      const companyResult = await sql`
        INSERT INTO companies (
          name, 
          user_id, 
          website, 
          location, 
          industry, 
          size, 
          description,
          logo_url
        )
        VALUES (
          'Demo Company', 
          ${employerId}, 
          'https://demo-company.com', 
          'Mumbai, India', 
          'Technology', 
          '50-100', 
          'A leading technology company specializing in web applications.',
          '/placeholder.svg?height=100&width=100'
        )
        RETURNING id
      `

      const companyId = companyResult[0].id

      // Create a second employer
      const employer2PasswordHash = await bcrypt.hash("employer123", 10)
      const employer2Result = await sql`
        INSERT INTO users (name, email, password_hash, role)
        VALUES ('TechCorp', 'techcorp@example.com', ${employer2PasswordHash}, 'employer')
        RETURNING id
      `

      const employer2Id = employer2Result[0].id

      // Create company for the second employer
      const company2Result = await sql`
        INSERT INTO companies (
          name, 
          user_id, 
          website, 
          location, 
          industry, 
          size, 
          description,
          logo_url
        )
        VALUES (
          'TechCorp', 
          ${employer2Id}, 
          'https://techcorp.com', 
          'Bangalore, India', 
          'Technology', 
          '101-500', 
          'An innovative technology company focused on AI and machine learning solutions.',
          '/placeholder.svg?height=100&width=100'
        )
        RETURNING id
      `

      const company2Id = company2Result[0].id

      // Create a third employer
      const employer3PasswordHash = await bcrypt.hash("employer123", 10)
      const employer3Result = await sql`
        INSERT INTO users (name, email, password_hash, role)
        VALUES ('HealthPlus', 'healthplus@example.com', ${employer3PasswordHash}, 'employer')
        RETURNING id
      `

      const employer3Id = employer3Result[0].id

      // Create company for the third employer
      const company3Result = await sql`
        INSERT INTO companies (
          name, 
          user_id, 
          website, 
          location, 
          industry, 
          size, 
          description,
          logo_url
        )
        VALUES (
          'HealthPlus', 
          ${employer3Id}, 
          'https://healthplus.com', 
          'Delhi, India', 
          'Healthcare', 
          '501-1000', 
          'A leading healthcare provider with a focus on digital health solutions.',
          '/placeholder.svg?height=100&width=100'
        )
        RETURNING id
      `

      const company3Id = company3Result[0].id

      // Create a job seeker
      const jobseekerPasswordHash = await bcrypt.hash("jobseeker123", 10)
      await sql`
        INSERT INTO users (name, email, password_hash, role)
        VALUES ('John Doe', 'jobseeker@example.com', ${jobseekerPasswordHash}, 'jobseeker')
      `

      // Insert sample jobs for Demo Company
      await sql`
        INSERT INTO jobs (
          title, 
          company_id, 
          company_name, 
          location, 
          type, 
          salary, 
          description, 
          requirements, 
          responsibilities, 
          tags
        ) VALUES (
          'Senior Frontend Developer', 
          ${companyId}, 
          'Demo Company', 
          'Mumbai, India', 
          'Full-time', 
          '₹15,00,000 - ₹25,00,000', 
          '<p>We are looking for a Senior Frontend Developer to join our team and help us build amazing user experiences.</p><p>As a Senior Frontend Developer, you will be responsible for implementing visual elements that users see and interact with in a web application. You will work closely with our design and backend teams to ensure a seamless user experience.</p>', 
          ARRAY['5+ years of experience with React', 'Strong TypeScript skills', 'Experience with state management libraries', 'Understanding of web accessibility standards'], 
          ARRAY['Develop new user-facing features', 'Build reusable components and libraries', 'Optimize applications for maximum speed and scalability', 'Collaborate with backend developers and designers'], 
          ARRAY['React', 'TypeScript', 'Frontend', 'Senior']
        )
      `

      await sql`
        INSERT INTO jobs (
          title, 
          company_id, 
          company_name, 
          location, 
          type, 
          salary, 
          description, 
          requirements, 
          responsibilities, 
          tags
        ) VALUES (
          'Backend Engineer', 
          ${companyId}, 
          'Demo Company', 
          'Remote', 
          'Full-time', 
          '₹12,00,000 - ₹20,00,000', 
          '<p>Join our backend team to build scalable APIs and services that power our applications.</p><p>As a Backend Engineer, you will design and implement server-side logic, maintain databases, and ensure high performance and responsiveness to requests from the front-end.</p>', 
          ARRAY['3+ years of experience with Node.js', 'Experience with PostgreSQL or similar databases', 'Knowledge of RESTful API design', 'Understanding of microservices architecture'], 
          ARRAY['Design and implement APIs', 'Optimize database queries', 'Implement security and data protection measures', 'Write unit and integration tests'], 
          ARRAY['Node.js', 'PostgreSQL', 'API', 'Backend']
        )
      `

      await sql`
        INSERT INTO jobs (
          title, 
          company_id, 
          company_name, 
          location, 
          type, 
          salary, 
          description, 
          requirements, 
          responsibilities, 
          tags
        ) VALUES (
          'UX/UI Designer', 
          ${companyId}, 
          'Demo Company', 
          'Bangalore, India', 
          'Full-time', 
          '₹10,00,000 - ₹18,00,000', 
          '<p>We are seeking a talented UX/UI Designer to create amazing user experiences for our products.</p><p>As a UX/UI Designer, you will be responsible for the user experience of our applications, including usability, interaction design, and visual design.</p>', 
          ARRAY['3+ years of experience in UX/UI design', 'Proficiency with design tools like Figma', 'Portfolio demonstrating UI design skills', 'Experience with user research and testing'], 
          ARRAY['Create wireframes, prototypes, and user flows', 'Conduct user research and usability testing', 'Collaborate with developers to implement designs', 'Maintain design system and documentation'], 
          ARRAY['UX', 'UI', 'Figma', 'Design']
        )
      `

      await sql`
        INSERT INTO jobs (
          title, 
          company_id, 
          company_name, 
          location, 
          type, 
          salary, 
          description, 
          requirements, 
          responsibilities, 
          tags
        ) VALUES (
          'Mobile Developer (iOS)', 
          ${companyId}, 
          'Demo Company', 
          'Mumbai, India', 
          'Full-time', 
          '₹12,00,000 - ₹20,00,000', 
          '<p>We are looking for an iOS Developer to join our mobile team.</p><p>As an iOS Developer, you will be responsible for developing and maintaining iOS applications, implementing new features, and ensuring high-quality code.</p>', 
          ARRAY['3+ years of experience with Swift', 'Experience with iOS frameworks', 'Knowledge of RESTful APIs', 'Understanding of mobile UI/UX principles'], 
          ARRAY['Develop and maintain iOS applications', 'Implement new features', 'Collaborate with design and backend teams', 'Ensure code quality and performance'], 
          ARRAY['iOS', 'Swift', 'Mobile', 'Apple']
        )
      `

      await sql`
        INSERT INTO jobs (
          title, 
          company_id, 
          company_name, 
          location, 
          type, 
          salary, 
          description, 
          requirements, 
          responsibilities, 
          tags
        ) VALUES (
          'Mobile Developer (Android)', 
          ${companyId}, 
          'Demo Company', 
          'Mumbai, India', 
          'Full-time', 
          '₹12,00,000 - ₹20,00,000', 
          '<p>We are looking for an Android Developer to join our mobile team.</p><p>As an Android Developer, you will be responsible for developing and maintaining Android applications, implementing new features, and ensuring high-quality code.</p>', 
          ARRAY['3+ years of experience with Kotlin or Java', 'Experience with Android SDK', 'Knowledge of RESTful APIs', 'Understanding of mobile UI/UX principles'], 
          ARRAY['Develop and maintain Android applications', 'Implement new features', 'Collaborate with design and backend teams', 'Ensure code quality and performance'], 
          ARRAY['Android', 'Kotlin', 'Mobile', 'Google']
        )
      `

      // Insert sample jobs for TechCorp
      await sql`
        INSERT INTO jobs (
          title, 
          company_id, 
          company_name, 
          location, 
          type, 
          salary, 
          description, 
          requirements, 
          responsibilities, 
          tags
        ) VALUES (
          'Machine Learning Engineer', 
          ${company2Id}, 
          'TechCorp', 
          'Bangalore, India', 
          'Full-time', 
          '₹18,00,000 - ₹30,00,000', 
          '<p>We are looking for a Machine Learning Engineer to help us build and deploy AI models.</p><p>As a Machine Learning Engineer, you will work on developing and implementing machine learning algorithms, analyzing data, and improving existing models.</p>', 
          ARRAY['3+ years of experience in machine learning', 'Strong Python skills', 'Experience with TensorFlow or PyTorch', 'Understanding of data structures and algorithms'], 
          ARRAY['Develop machine learning models', 'Process and analyze large datasets', 'Deploy models to production', 'Collaborate with data scientists and engineers'], 
          ARRAY['Machine Learning', 'Python', 'AI', 'TensorFlow']
        )
      `

      await sql`
        INSERT INTO jobs (
          title, 
          company_id, 
          company_name, 
          location, 
          type, 
          salary, 
          description, 
          requirements, 
          responsibilities, 
          tags
        ) VALUES (
          'DevOps Engineer', 
          ${company2Id}, 
          'TechCorp', 
          'Remote', 
          'Full-time', 
          '₹14,00,000 - ₹22,00,000', 
          '<p>Join our DevOps team to build and maintain our cloud infrastructure.</p><p>As a DevOps Engineer, you will be responsible for implementing and managing our CI/CD pipelines, cloud infrastructure, and monitoring systems.</p>', 
          ARRAY['3+ years of experience with AWS or Azure', 'Experience with Docker and Kubernetes', 'Knowledge of infrastructure as code tools like Terraform', 'Understanding of CI/CD principles'], 
          ARRAY['Manage cloud infrastructure', 'Implement and maintain CI/CD pipelines', 'Monitor system performance and reliability', 'Collaborate with development teams'], 
          ARRAY['DevOps', 'AWS', 'Kubernetes', 'CI/CD']
        )
      `

      await sql`
        INSERT INTO jobs (
          title, 
          company_id, 
          company_name, 
          location, 
          type, 
          salary, 
          description, 
          requirements, 
          responsibilities, 
          tags
        ) VALUES (
          'Data Scientist', 
          ${company2Id}, 
          'TechCorp', 
          'Hyderabad, India', 
          'Full-time', 
          '₹16,00,000 - ₹28,00,000', 
          '<p>We are seeking a Data Scientist to help us extract insights from our data.</p><p>As a Data Scientist, you will analyze data, build predictive models, and communicate findings to stakeholders.</p>', 
          ARRAY['3+ years of experience in data science', 'Strong statistical knowledge', 'Experience with Python and data analysis libraries', 'Understanding of machine learning algorithms'], 
          ARRAY['Analyze and interpret complex data', 'Build predictive models', 'Communicate findings to stakeholders', 'Collaborate with engineering teams'], 
          ARRAY['Data Science', 'Python', 'Statistics', 'Machine Learning']
        )
      `

      await sql`
        INSERT INTO jobs (
          title, 
          company_id, 
          company_name, 
          location, 
          type, 
          salary, 
          description, 
          requirements, 
          responsibilities, 
          tags
        ) VALUES (
          'Product Manager', 
          ${company2Id}, 
          'TechCorp', 
          'Delhi, India', 
          'Full-time', 
          '₹20,00,000 - ₹35,00,000', 
          '<p>We are looking for a Product Manager to help us define and execute our product strategy.</p><p>As a Product Manager, you will work with cross-functional teams to define product requirements, prioritize features, and deliver successful products.</p>', 
          ARRAY['5+ years of experience in product management', 'Experience with agile methodologies', 'Strong analytical and problem-solving skills', 'Excellent communication and leadership abilities'], 
          ARRAY['Define product vision and strategy', 'Gather and prioritize product requirements', 'Work with engineering, design, and marketing teams', 'Analyze market trends and competition'], 
          ARRAY['Product Management', 'Agile', 'Strategy', 'Leadership']
        )
      `

      await sql`
        INSERT INTO jobs (
          title, 
          company_id, 
          company_name, 
          location, 
          type, 
          salary, 
          description, 
          requirements, 
          responsibilities, 
          tags
        ) VALUES (
          'Cybersecurity Analyst', 
          ${company2Id}, 
          'TechCorp', 
          'Pune, India', 
          'Full-time', 
          '₹15,00,000 - ₹25,00,000', 
          '<p>We are looking for a Cybersecurity Analyst to help us protect our systems and data.</p><p>As a Cybersecurity Analyst, you will monitor systems for security breaches, implement security measures, and respond to incidents.</p>', 
          ARRAY['3+ years of experience in cybersecurity', 'Knowledge of security frameworks and best practices', 'Experience with security tools and technologies', 'Understanding of network security principles'], 
          ARRAY['Monitor systems for security breaches', 'Implement security measures', 'Respond to security incidents', 'Conduct security assessments'], 
          ARRAY['Cybersecurity', 'Security', 'Network', 'Compliance']
        )
      `

      // Insert sample jobs for HealthPlus
      await sql`
        INSERT INTO jobs (
          title, 
          company_id, 
          company_name, 
          location, 
          type, 
          salary, 
          description, 
          requirements, 
          responsibilities, 
          tags
        ) VALUES (
          'Medical Software Developer', 
          ${company3Id}, 
          'HealthPlus', 
          'Delhi, India', 
          'Full-time', 
          '₹14,00,000 - ₹22,00,000', 
          '<p>We are looking for a Medical Software Developer to help us build healthcare applications.</p><p>As a Medical Software Developer, you will develop software for healthcare applications, ensuring compliance with medical standards and regulations.</p>', 
          ARRAY['3+ years of experience in software development', 'Knowledge of healthcare standards (HL7, FHIR, etc.)', 'Experience with Java or C#', 'Understanding of medical terminology'], 
          ARRAY['Develop healthcare applications', 'Ensure compliance with medical standards', 'Collaborate with healthcare professionals', 'Implement security measures for patient data'], 
          ARRAY['Healthcare', 'Java', 'Medical', 'Software']
        )
      `

      await sql`
        INSERT INTO jobs (
          title, 
          company_id, 
          company_name, 
          location, 
          type, 
          salary, 
          description, 
          requirements, 
          responsibilities, 
          tags
        ) VALUES (
          'Clinical Data Analyst', 
          ${company3Id}, 
          'HealthPlus', 
          'Delhi, India', 
          'Full-time', 
          '₹12,00,000 - ₹18,00,000', 
          '<p>We are seeking a Clinical Data Analyst to help us analyze and interpret clinical data.</p><p>As a Clinical Data Analyst, you will analyze and interpret clinical data, generate reports, and support clinical research efforts.</p>', 
          ARRAY['3+ years of experience in data analysis', 'Knowledge of healthcare data standards', 'Experience with statistical analysis tools', 'Understanding of clinical terminology'], 
          ARRAY['Analyze and interpret clinical data', 'Generate reports for stakeholders', 'Support clinical research efforts', 'Ensure data quality and integrity'], 
          ARRAY['Data Analysis', 'Healthcare', 'Statistics', 'Clinical']
        )
      `

      await sql`
        INSERT INTO jobs (
          title, 
          company_id, 
          company_name, 
          location, 
          type, 
          salary, 
          description, 
          requirements, 
          responsibilities, 
          tags
        ) VALUES (
          'Healthcare Project Manager', 
          ${company3Id}, 
          'HealthPlus', 
          'Mumbai, India', 
          'Full-time', 
          '₹18,00,000 - ₹28,00,000', 
          '<p>We are looking for a Healthcare Project Manager to lead our healthcare initiatives.</p><p>As a Healthcare Project Manager, you will plan, execute, and oversee healthcare projects, ensuring they meet quality standards and are delivered on time and within budget.</p>', 
          ARRAY['5+ years of experience in project management', 'PMP certification preferred', 'Experience in healthcare industry', 'Strong leadership and communication skills'], 
          ARRAY['Plan and execute healthcare projects', 'Manage project resources and budgets', 'Coordinate with stakeholders', 'Ensure compliance with healthcare regulations'], 
          ARRAY['Project Management', 'Healthcare', 'Leadership', 'PMP']
        )
      `

      await sql`
        INSERT INTO jobs (
          title, 
          company_id, 
          company_name, 
          location, 
          type, 
          salary, 
          description, 
          requirements, 
          responsibilities, 
          tags
        ) VALUES (
          'Telemedicine Specialist', 
          ${company3Id}, 
          'HealthPlus', 
          'Remote', 
          'Full-time', 
          '₹10,00,000 - ₹16,00,000', 
          '<p>We are seeking a Telemedicine Specialist to support our virtual healthcare services.</p><p>As a Telemedicine Specialist, you will facilitate virtual consultations, provide technical support to patients and healthcare providers, and ensure a smooth telemedicine experience.</p>', 
          ARRAY['2+ years of experience in healthcare or customer support', 'Knowledge of telemedicine platforms', 'Strong communication and problem-solving skills', 'Understanding of healthcare privacy regulations'], 
          ARRAY['Facilitate virtual consultations', 'Provide technical support', 'Ensure patient privacy and data security', 'Coordinate with healthcare providers'], 
          ARRAY['Telemedicine', 'Healthcare', 'Customer Support', 'Virtual Care']
        )
      `

      await sql`
        INSERT INTO jobs (
          title, 
          company_id, 
          company_name, 
          location, 
          type, 
          salary, 
          description, 
          requirements, 
          responsibilities, 
          tags
        ) VALUES (
          'Health Informatics Specialist', 
          ${company3Id}, 
          'HealthPlus', 
          'Bangalore, India', 
          'Full-time', 
          '₹14,00,000 - ₹22,00,000', 
          '<p>We are looking for a Health Informatics Specialist to help us manage and analyze healthcare data.</p><p>As a Health Informatics Specialist, you will design and implement health information systems, analyze healthcare data, and ensure data quality and compliance with regulations.</p>', 
          ARRAY['3+ years of experience in health informatics', 'Knowledge of healthcare data standards', 'Experience with electronic health records (EHR) systems', 'Understanding of healthcare regulations'], 
          ARRAY['Design and implement health information systems', 'Analyze healthcare data', 'Ensure data quality and compliance', 'Support clinical decision-making'], 
          ARRAY['Health Informatics', 'Healthcare', 'Data', 'EHR']
        )
      `
    }

    return NextResponse.json({
      success: true,
      message: "Database initialized successfully",
    })
  } catch (error) {
    console.error("Error initializing database:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to initialize database: " + (error instanceof Error ? error.message : String(error)),
      },
      { status: 500 },
    )
  }
}
