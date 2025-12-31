// const Wallet = require("../models/walletModel");
// const User = require("../models/userModel");
// const Razorpay = require("razorpay");
// const { v4: uuidv4 } = require("uuid");

// const REFERRAL_BONUS = {
// 	REFERRER: 100,
// 	REFEREE: 10,
// };

// // Get wallet details and transactions
// async function getWalletDetails(req, res) {
// 	try {
// 		const userId = req.user?.userId || req.user?._id;
// 		if (!userId) {
// 			return res.status(400).json({ message: "User ID is required" });
// 		}
		
// 		console.log('Fetching wallet details for userId:', userId);
		
// 		// First check if wallet exists
// 		let wallet = await Wallet.findOne({ userId: userId });

// 		// If no wallet exists, get user info and create one
// 		if (!wallet) {
// 			const user = await User.findById(userId);
// 			if (!user) {
// 				return res.status(404).json({ message: "User not found" });
// 			}

// 			wallet = new Wallet({
// 				userId: user._id,
// 				referralCode: user.referralCode, // Use the referral code from user
// 				balance: 0,
// 				transactions: [],
// 				withdrawalRequests: [],
// 			});
// 			await wallet.save();
// 		}

// 		res.json({ wallet });
// 	} catch (error) {
// 		console.error("Error in getWalletDetails:", error);
// 		res
// 			.status(500)
// 			.json({ message: "Error fetching wallet details", error: error.message });
// 	}
// }

// // Get transactions
// async function getTransactions(req, res) {
// 	try {
// 		const userId = req.user?.userId || req.user?._id;
// 		if (!userId) {
// 			return res.status(400).json({ message: "User ID is required" });
// 		}
		
// 		console.log('Fetching transactions for userId:', userId);
		
// 		const wallet = await Wallet.findOne({ userId: userId });
// 		if (!wallet) {
// 			return res.status(404).json({ message: "Wallet not found" });
// 		}

// 		res.json({ transactions: wallet.transactions });
// 	} catch (error) {
// 		res
// 			.status(500)
// 			.json({ message: "Error fetching transactions", error: error.message });
// 	}
// }

// async function requestWithdrawal(req, res) {
// 	const userId = req.user?.userId || req.user?._id;
// 	const { amount, useReferralPoints } = req.body;

// 	if (!userId) {
// 		return res.status(400).json({ message: "User ID is required" });
// 	}

// 	console.log('Processing withdrawal request for userId:', userId, 'amount:', amount);

// 	if (!amount || amount <= 0) {
// 		return res.status(400).json({ message: "Invalid withdrawal amount" });
// 	}

// 	const wallet = await Wallet.findOne({ userId: userId });
// 	if (!wallet) {
// 		return res.status(404).json({ message: "Wallet not found" });
// 	}

// 	let availableBalance = wallet.balance;
// 	if (useReferralPoints) {
// 		availableBalance += wallet.referralEarnings;
// 	}

// 	if (availableBalance < amount) {
// 		return res.status(400).json({ message: "Insufficient funds" });
// 	}

// 	if (useReferralPoints) {
// 		const remainingAmount = amount - wallet.balance;
// 		wallet.balance = Math.max(0, wallet.balance - amount);
// 		wallet.referralEarnings = Math.max(
// 			0,
// 			wallet.referralEarnings - remainingAmount
// 		);
// 	} else {
// 		wallet.balance -= amount;
// 	}

// 	wallet.withdrawalRequests.push({
// 		requestId: uuidv4(),
// 		amount,
// 		status: "pending",
// 		createdAt: new Date(),
// 	});

// 	await wallet.save();

// 	res.json({ message: "Withdrawal request submitted successfully" });
// }

// // Get referral stats
// async function getReferralStats(req, res) {
// 	try {
// 		const userId = req.user?.userId || req.user?._id;
// 		if (!userId) {
// 			return res.status(400).json({ message: "User ID is required" });
// 		}
		
// 		console.log('Fetching referral stats for userId:', userId);
		
// 		const user = await User.findById(userId);
// 		if (!user) {
// 			return res.status(404).json({ message: "User not found" });
// 		}

// 		// FIXED: Use referredUsers array instead of querying by referredBy
// 		const referredUserIds = user.referredUsers || [];
// 		const referredUsers = await User.find({
// 			_id: { $in: referredUserIds },
// 		}).select("name email createdAt _id");

// 		const wallet = await Wallet.findOne({ userId: userId });
// 		if (!wallet) {
// 			return res.status(404).json({ message: "Wallet not found" });
// 		}

// 		const stats = {
// 			balance: wallet.balance,
// 			totalEarnings: wallet.referralEarnings,
// 			referralCode: user.referralCode,
// 			totalReferrals: referredUserIds.length,
// 			referredUsers: referredUsers.map((user) => ({
// 				id: user._id,
// 				name: user.name,
// 				email: user.email,
// 				joinedAt: user.createdAt,
// 			})),
// 		};

// 		res.json({ stats });
// 	} catch (error) {
// 		console.error("Error in getReferralStats:", error);
// 		res
// 			.status(500)
// 			.json({ message: "Error fetching referral stats", error: error.message });
// 	}
// }

// // Initialize wallet for new user
// async function initializeWallet(userId, referralCode = null) {
// 	try {
// 		const user = await User.findById(userId);
// 		if (!user) {
// 			throw new Error("User not found");
// 		}

// 		let wallet = await Wallet.findOne({ userId });

// 		if (!wallet) {
// 			wallet = new Wallet({
// 				userId,
// 				referralCode: user.referralCode, // Use user's referral code
// 				referredBy: user.referredBy,
// 			});
// 			await wallet.save();
// 		}

// 		return wallet;
// 	} catch (error) {
// 		console.error("Error in initializeWallet:", error);
// 		throw error;
// 	}
// }

// async function handleReferral(referrerCode, refereeId) {
// 	try {
// 		// Find the referrer by referral code
// 		const referrer = await User.findOne({ referralCode: referrerCode });
// 		if (!referrer) {
// 			throw new Error("Invalid referral code");
// 		}

// 		// Credit referral bonus to the referrer
// 		await creditReferralBonus(referrer._id, refereeId, REFERRAL_BONUS.REFERRER);

// 		// Credit referral bonus to the referee (new user)
// 		await creditReferralBonus(refereeId, referrer._id, REFERRAL_BONUS.REFEREE);

// 		// Update the referredUsers array of the referrer
// 		await User.findByIdAndUpdate(referrer._id, {
// 			$push: { referredUsers: refereeId }, // Push the new referred user's ID
// 		});
// 		console.log(`Referred user added to ${referrer.name}'s referredUsers`);
// 	} catch (error) {
// 		console.error("Error in handleReferral:", error);
// 		throw error;
// 	}
// }

// async function creditReferralBonus(userId, referredUserId, amount) {
// 	const wallet = await Wallet.findOne({ userId });
// 	if (!wallet) throw new Error("Wallet not found");

// 	wallet.balance += amount;
// 	wallet.referralEarnings += amount;
// 	wallet.transactions.push({
// 		transactionId: uuidv4(),
// 		amount,
// 		type: "credit",
// 		status: "approved",
// 		description: `Referral bonus for referring user ${referredUserId}`,
// 	});

// 	await wallet.save();
// }

// module.exports = {
// 	getWalletDetails,
// 	getTransactions,
// 	requestWithdrawal,
// 	getReferralStats,
// 	initializeWallet,
// 	handleReferral,
// };




const Wallet = require("../models/walletModel");
const User = require("../models/userModel");
const Razorpay = require("razorpay");
const { v4: uuidv4 } = require("uuid");

const REFERRAL_BONUS = {
	REFERRER: 100,
	REFEREE: 10,
};

// Get wallet details and transactions
async function getWalletDetails(req, res) {
	try {
		const userId = req.user?.userId || req.user?._id;
		if (!userId) {
			return res.status(400).json({ message: "User ID is required" });
		}
		
		console.log('Fetching wallet details for userId:', userId);
		
		// First check if wallet exists
		let wallet = await Wallet.findOne({ userId: userId });

		// If no wallet exists, get user info and create one
		if (!wallet) {
			const user = await User.findById(userId);
			if (!user) {
				return res.status(404).json({ message: "User not found" });
			}

			wallet = new Wallet({
				userId: user._id,
				referralCode: user.referralCode, // Use the referral code from user
				balance: 0,
				transactions: [],
				withdrawalRequests: [],
			});
			await wallet.save();
		}

		res.json({ wallet });
	} catch (error) {
		console.error("Error in getWalletDetails:", error);
		res
			.status(500)
			.json({ message: "Error fetching wallet details", error: error.message });
	}
}

// Get transactions
async function getTransactions(req, res) {
	try {
		const userId = req.user?.userId || req.user?._id;
		if (!userId) {
			return res.status(400).json({ message: "User ID is required" });
		}
		
		console.log('Fetching transactions for userId:', userId);
		
		const wallet = await Wallet.findOne({ userId: userId });
		if (!wallet) {
			return res.status(404).json({ message: "Wallet not found" });
		}

		res.json({ transactions: wallet.transactions });
	} catch (error) {
		res
			.status(500)
			.json({ message: "Error fetching transactions", error: error.message });
	}
}

async function requestWithdrawal(req, res) {
	const userId = req.user?.userId || req.user?._id;
	const { amount, useReferralPoints } = req.body;

	if (!userId) {
		return res.status(400).json({ message: "User ID is required" });
	}

	console.log('Processing withdrawal request for userId:', userId, 'amount:', amount);

	if (!amount || amount <= 0) {
		return res.status(400).json({ message: "Invalid withdrawal amount" });
	}

	const wallet = await Wallet.findOne({ userId: userId });
	if (!wallet) {
		return res.status(404).json({ message: "Wallet not found" });
	}

	let availableBalance = wallet.balance;
	if (useReferralPoints) {
		availableBalance += wallet.referralEarnings;
	}

	if (availableBalance < amount) {
		return res.status(400).json({ message: "Insufficient funds" });
	}

	if (useReferralPoints) {
		const remainingAmount = amount - wallet.balance;
		wallet.balance = Math.max(0, wallet.balance - amount);
		wallet.referralEarnings = Math.max(
			0,
			wallet.referralEarnings - remainingAmount
		);
	} else {
		wallet.balance -= amount;
	}

	wallet.withdrawalRequests.push({
		requestId: uuidv4(),
		amount,
		status: "pending",
		createdAt: new Date(),
	});

	await wallet.save();

	res.json({ message: "Withdrawal request submitted successfully" });
}

// Get referral stats
async function getReferralStats(req, res) {
	try {
		const userId = req.user?.userId || req.user?._id;
		if (!userId) {
			return res.status(400).json({ message: "User ID is required" });
		}
		
		console.log('Fetching referral stats for userId:', userId);
		
		const user = await User.findById(userId);
		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		// FIXED: Use referredUsers array instead of querying by referredBy
		const referredUserIds = user.referredUsers || [];
		const referredUsers = await User.find({
			_id: { $in: referredUserIds },
		}).select("name email createdAt _id");

		const wallet = await Wallet.findOne({ userId: userId });
		if (!wallet) {
			return res.status(404).json({ message: "Wallet not found" });
		}

		const stats = {
			balance: wallet.balance,
			totalEarnings: wallet.referralEarnings,
			referralCode: user.referralCode,
			totalReferrals: referredUserIds.length,
			referredUsers: referredUsers.map((user) => ({
				id: user._id,
				name: user.name,
				email: user.email,
				joinedAt: user.createdAt,
			})),
		};

		res.json({ stats });
	} catch (error) {
		console.error("Error in getReferralStats:", error);
		res
			.status(500)
			.json({ message: "Error fetching referral stats", error: error.message });
	}
}

// Initialize wallet for new user
async function initializeWallet(userId, referralCode = null) {
	try {
		const user = await User.findById(userId);
		if (!user) {
			throw new Error("User not found");
		}

		let wallet = await Wallet.findOne({ userId });

		if (!wallet) {
			wallet = new Wallet({
				userId,
				referralCode: user.referralCode, // Use user's referral code
				referredBy: user.referredBy,
			});
			await wallet.save();
		}

		return wallet;
	} catch (error) {
		console.error("Error in initializeWallet:", error);
		throw error;
	}
}

async function handleReferral(referrerCode, refereeId) {
	try {
		console.log(`Processing referral: code=${referrerCode}, newUserId=${refereeId}`);
		
		// Find the referrer by referral code
		const referrer = await User.findOne({ referralCode: referrerCode });
		if (!referrer) {
			console.log(`Invalid referral code: ${referrerCode}`);
			throw new Error("Invalid referral code");
		}

		console.log(`Found referrer: ${referrer.name} (${referrer._id})`);

		// Check if already referred to prevent duplicate entries
		if (referrer.referredUsers && referrer.referredUsers.includes(refereeId)) {
			console.log(`User ${refereeId} already referred by ${referrer._id}`);
			return;
		}

		// Credit referral bonus to the referrer
		await creditReferralBonus(referrer._id, refereeId, REFERRAL_BONUS.REFERRER, 'referrer');
		console.log(`Credited ₹${REFERRAL_BONUS.REFERRER} to referrer ${referrer.name}`);

		// Credit referral bonus to the referee (new user)
		await creditReferralBonus(refereeId, referrer._id, REFERRAL_BONUS.REFEREE, 'referee');
		console.log(`Credited ₹${REFERRAL_BONUS.REFEREE} to new user ${refereeId}`);

		// Update the referredUsers array of the referrer
		const updateResult = await User.findByIdAndUpdate(
			referrer._id,
			{ $addToSet: { referredUsers: refereeId } }, // Use $addToSet to prevent duplicates
			{ new: true }
		);
		
		if (updateResult) {
			console.log(`Successfully added user ${refereeId} to ${referrer.name}'s referredUsers. Total referrals: ${updateResult.referredUsers.length}`);
		} else {
			console.error(`Failed to update referrer's referredUsers array`);
		}
		
	} catch (error) {
		console.error("Error in handleReferral:", error);
		throw error;
	}
}

async function creditReferralBonus(userId, referredUserId, amount, role = 'referrer') {
	try {
		const wallet = await Wallet.findOne({ userId });
		if (!wallet) {
			console.error(`Wallet not found for user: ${userId}`);
			throw new Error("Wallet not found");
		}

		console.log(`Crediting ₹${amount} to ${role} wallet ${userId}`);

		wallet.balance += amount;
		wallet.referralEarnings += amount;
		
		const description = role === 'referrer' 
			? `Referral bonus for referring user ${referredUserId}`
			: `Welcome bonus for joining via referral`;
		
		wallet.transactions.push({
			transactionId: uuidv4(),
			amount,
			type: "credit",
			status: "approved",
			description,
			createdAt: new Date()
		});

		await wallet.save();
		console.log(`Successfully credited ₹${amount} to ${role}. New balance: ₹${wallet.balance}`);
	} catch (error) {
		console.error(`Error crediting referral bonus:`, error);
		throw error;
	}
}

module.exports = {
	getWalletDetails,
	getTransactions,
	requestWithdrawal,
	getReferralStats,
	initializeWallet,
	handleReferral,
};
