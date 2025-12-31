/**
 * Service Route Mapping Utility
 *
 * This file provides a standardized way to map between service names and URL paths.
 * Use these functions to ensure consistent URL routing throughout the application.
 */

// Map of known service pages with their standardized paths
export const SERVICE_PATHS = {
	// Loan services
	"business loan": "/business-loan",
	"business loans": "/business-loan",
	"personal loan": "/personalloan",
	"personal loans": "/personalloan",
	"home loan": "/home-loan",
	"home loans": "/home-loan",
	"vehicle loan": "/vehicle-loan",
	"vehicle loans": "/vehicle-loan",
	"car loan": "/vehicle-loan",
	"car loans": "/vehicle-loan",
	"auto loan": "/vehicle-loan",
	"gold loan": "/gold-loan",
	"gold loans": "/gold-loan",
	"loan against gold": "/gold-loan",
	"loan against property": "/loan-against-property",
	lap: "/loan-against-property",
	"property loan": "/loan-against-property",
	overdraft: "/overdraft",
	"overdraft facility": "/overdraft",
	"od facility": "/overdraft",

	// Insurance services
	"term insurance": "/term-insurance",
	"term life insurance": "/term-insurance",
	"life insurance": "/term-insurance",
	"health insurance": "/health-insurance",
	"medical insurance": "/health-insurance",
	"vehicle insurance": "/vehicle-insurance",
	"car insurance": "/vehicle-insurance",
	"auto insurance": "/vehicle-insurance",
	"workmen compensation": "/workmen-compensation",
	"workmen compensation insurance": "/workmen-compensation",
	"worker compensation": "/workmen-compensation",
	"workers compensation": "/workmen-compensation",
	"personal accident": "/personal-accident",
	"personal accident insurance": "/personal-accident",
	"accident insurance": "/personal-accident",

	// Card services
	"credit card": "/credit-card",
	"credit cards": "/credit-card",

	// Investment services
	"mutual funds": "/mutual-funds",
	"mutual fund": "/mutual-funds",
	investment: "/mutual-funds",
	investments: "/mutual-funds",
	"portfolio builder": "/portfolio-builder",
	"portfolio management": "/portfolio-builder",
	"investment portfolio": "/portfolio-builder",
	"wealth management": "/portfolio-builder",

	// Tax services
	"itr filing": "/itr-filing",
	"income tax return": "/itr-filing",
	"income tax return filing": "/itr-filing",
	"tax filing": "/itr-filing",
	"income tax": "/itr-filing",
	"tax planning": "/tax-planning",
	"tax consultant": "/tax-planning",
	"tax consultancy": "/tax-planning",
	"tax advisory": "/tax-planning",
	"tds returns": "/tds-returns",
	"tds filing": "/tds-returns",
	"tds return filing": "/tds-returns",
	"tax deducted at source": "/tds-returns",
	gst: "/gst",
	"gst filing": "/gst",
	"goods and services tax": "/gst",
	"gst returns": "/gst",
	"gst registration": "/gst",

	// Compliance services
	"pf and esi": "/pf-and-esi",
	"pf & esi": "/pf-and-esi",
	"provident fund": "/pf-and-esi",
	"employee state insurance": "/pf-and-esi",
	epf: "/pf-and-esi",
	esi: "/pf-and-esi",

	// Registration services
	registrations: "/registrations",
	"business registration": "/registrations",
	"company registration": "/registrations",
	"llp registration": "/registrations",
	"shop registration": "/registrations",
	"msme registration": "/registrations",
	"udyam registration": "/registrations",
};

// Array of standard service paths for dynamic route building
export const STANDARD_SERVICE_PATHS = [
	{ path: "/business-loan", namePattern: /business loan/i },
	{ path: "/personalloan", namePattern: /personal loan/i },
	{ path: "/home-loan", namePattern: /home loan/i },
	{ path: "/vehicle-loan", namePattern: /(vehicle loan|car loan|auto loan)/i },
	{ path: "/gold-loan", namePattern: /(gold loan|loan against gold)/i },
	{
		path: "/loan-against-property",
		namePattern: /(loan against property|property loan|lap)/i,
	},
	{
		path: "/term-insurance",
		namePattern: /(term insurance|term life insurance|life insurance)/i,
	},
	{
		path: "/health-insurance",
		namePattern: /(health insurance|medical insurance)/i,
	},
	{
		path: "/vehicle-insurance",
		namePattern: /(vehicle insurance|car insurance|auto insurance)/i,
	},
	{
		path: "/workmen-compensation",
		namePattern:
			/(workmen compensation|worker compensation|workers compensation)/i,
	},
	{
		path: "/personal-accident",
		namePattern:
			/(personal accident|personal accident insurance|accident insurance)/i,
	},
	{ path: "/credit-card", namePattern: /credit card/i },
	{
		path: "/overdraft",
		namePattern: /(overdraft|overdraft facility|od facility)/i,
	},
	{
		path: "/mutual-funds",
		namePattern: /(mutual funds|mutual fund|investment|investments)/i,
	},
	{
		path: "/portfolio-builder",
		namePattern:
			/(portfolio builder|portfolio management|investment portfolio|wealth management)/i,
	},
	{
		path: "/itr-filing",
		namePattern:
			/(itr filing|income tax return|income tax return filing|tax filing|income tax)/i,
	},
	{
		path: "/tax-planning",
		namePattern: /(tax planning|tax consultant|tax consultancy|tax advisory)/i,
	},
	{
		path: "/tds-returns",
		namePattern:
			/(tds returns|tds filing|tds return filing|tax deducted at source)/i,
	},
	{
		path: "/gst",
		namePattern:
			/(gst|gst filing|goods and services tax|gst returns|gst registration)/i,
	},
	{
		path: "/pf-and-esi",
		namePattern:
			/(pf and esi|pf & esi|provident fund|employee state insurance|epf|esi)/i,
	},
	{
		path: "/registrations",
		namePattern:
			/(registrations|business registration|company registration|llp registration|shop registration|msme registration|udyam registration)/i,
	},
];

/**
 * Get the appropriate route path for a service based on its name
 *
 * @param {Object} service - The service object with name and category
 * @returns {string} The path to use for routing to this service
 */
export const getServicePath = (service) => {
	if (!service) return "/services";

	const serviceName = service.name?.toLowerCase();
	const serviceCategory = service.category?.toLowerCase();

	// Check if we have a direct mapping for this service name
	if (serviceName && SERVICE_PATHS[serviceName]) {
		return SERVICE_PATHS[serviceName];
	}

	// Try to match using regex patterns
	for (const { path, namePattern } of STANDARD_SERVICE_PATHS) {
		if (
			(serviceName && namePattern.test(serviceName)) ||
			(serviceCategory && namePattern.test(serviceCategory))
		) {
			return path;
		}
	}

	// If the service has a static page flag but doesn't match known patterns
	if (service.hasStaticPage) {
		// Generate slug from the service name
		const slug = (serviceName || "")
			.replace(/\s+/g, "-")
			.replace(/[^a-z0-9-]/g, "");
		console.log(`Using static page slug: ${slug}`);
		return `/${slug}`;
	}

	// Default fallback for services without static pages
	return `/services/${service._id}`;
};

/**
 * Create a slug from a service name
 *
 * @param {string} name - The service name
 * @returns {string} URL-friendly slug
 */
export const createServiceSlug = (name) => {
	if (!name) return "";
	return name
		.toLowerCase()
		.replace(/\s+/g, "-")
		.replace(/[^a-z0-9-]/g, "");
};

export default {
	SERVICE_PATHS,
	STANDARD_SERVICE_PATHS,
	getServicePath,
	createServiceSlug,
};
