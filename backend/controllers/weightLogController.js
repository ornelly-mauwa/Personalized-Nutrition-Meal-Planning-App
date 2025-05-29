import models from '../models/index.js';

const { WeightLog } = models

export const logWeight = async (req, res) => {
    const { userId, weight, date } = req.body;

    try {
        const weightLog = await WeightLog.create({
            userId,
            weight,
            date,
        });

        res.status(201).json(weightLog);
    } catch (error) {
        res.status(500).json({ error: 'Failed to log weight' });
    }
};

export const getWeightLogs = async (req, res) => {
    const { userId } = req.params;

    try {
        const logs = await WeightLog.findAll({
            where: { userId },
            order: [['date', 'ASC']],
        });

        res.status(200).json(logs);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch weight logs' });
    }
};
export const getWeightLogByDate = async (req, res) => {
    const { userId } = req.params;
    const { date } = req.query;

    try {
        const log = await WeightLog.findOne({
            where: { userId, date },
        });

        if (!log) {
            return res.status(404).json({ message: 'No weight log found for this date' });
        }

        res.status(200).json(log);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch weight log' });
    }
};