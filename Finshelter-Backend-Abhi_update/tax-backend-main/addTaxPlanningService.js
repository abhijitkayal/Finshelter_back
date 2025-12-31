const mongoose = require('mongoose');
const Service = require('./models/serviceModel');

async function addTaxPlanningService() {
    try {
        await mongoose.connect('mongodb://localhost:27017/tax-service-db');
        console.log('Connected to MongoDB');

        const taxPlanningService = {
            _id: 'SER013',
            category: 'Tax Services',
            name: 'Tax Planning',
            description: 'Comprehensive tax planning services to optimize your tax efficiency and maximize savings',
            hsncode: '998399',
            currency: 'INR',
            gstRate: 18,
            isActive: true,
            hasStaticPage: true,
            packages: [
                {
                    name: 'Individual Tax Planning',
                    description: 'Comprehensive tax planning for salaried professionals and individuals',
                    actualPrice: 2999,
                    salePrice: 1999,
                    processingDays: 7,
                    features: [
                        'Personalized tax-saving strategy',
                        'Investment advisory for tax optimization',
                        'Section 80C, 80D deduction planning',
                        'Tax-efficient investment recommendations',
                        'Annual tax planning consultation',
                        'Email and phone support'
                    ],
                    requiredDocuments: [
                        {
                            name: 'Previous Year ITR',
                            description: 'Last year\'s Income Tax Return',
                            required: true
                        },
                        {
                            name: 'Salary Slips',
                            description: 'Last 3 months salary slips',
                            required: true
                        },
                        {
                            name: 'Investment Proofs',
                            description: 'Existing investment documents (PPF, ELSS, etc.)',
                            required: false
                        }
                    ]
                },
                {
                    name: 'Business Tax Planning',
                    description: 'Advanced tax planning for business owners and self-employed professionals',
                    actualPrice: 5999,
                    salePrice: 3999,
                    processingDays: 10,
                    features: [
                        'Business expense optimization',
                        'Depreciation and asset planning',
                        'GST and income tax integration',
                        'Tax-efficient business structuring',
                        'Quarterly tax planning reviews',
                        'Dedicated tax consultant',
                        'Priority support'
                    ],
                    requiredDocuments: [
                        {
                            name: 'Business Registration Documents',
                            description: 'GST, PAN, and business registration certificates',
                            required: true
                        },
                        {
                            name: 'Previous Financial Statements',
                            description: 'Last year\'s balance sheet and P&L statement',
                            required: true
                        },
                        {
                            name: 'Expense Records',
                            description: 'Business expense documentation',
                            required: true
                        }
                    ]
                },
                {
                    name: 'Comprehensive Wealth Planning',
                    description: 'Complete tax and wealth planning for high net-worth individuals',
                    actualPrice: 9999,
                    salePrice: 6999,
                    processingDays: 14,
                    features: [
                        'Multi-year tax planning strategy',
                        'Wealth creation and tax optimization',
                        'Estate and succession planning',
                        'International taxation guidance',
                        'Portfolio rebalancing recommendations',
                        'Monthly consultation calls',
                        'Dedicated wealth manager',
                        '24/7 priority support'
                    ],
                    requiredDocuments: [
                        {
                            name: 'Complete Financial Portfolio',
                            description: 'Details of all investments, properties, and assets',
                            required: true
                        },
                        {
                            name: 'Previous ITRs',
                            description: 'Last 3 years Income Tax Returns',
                            required: true
                        },
                        {
                            name: 'Business/Income Documents',
                            description: 'All sources of income documentation',
                            required: true
                        }
                    ]
                }
            ]
        };

        // Check if service already exists
        const existingService = await Service.findById('SER013');
        
        if (existingService) {
            console.log('Tax Planning service already exists. Updating...');
            await Service.findByIdAndUpdate('SER013', taxPlanningService);
            console.log('Tax Planning service updated successfully!');
        } else {
            await Service.create(taxPlanningService);
            console.log('Tax Planning service created successfully!');
        }

        // Display the created service
        const createdService = await Service.findById('SER013');
        console.log('\nService Details:');
        console.log(JSON.stringify(createdService, null, 2));

        await mongoose.connection.close();
        console.log('\nDatabase connection closed');
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

addTaxPlanningService();
