import { Response } from 'express';
import bcrypt from 'bcryptjs';
import { AuthRequest } from '../middleware/authMiddleware';
import { db } from '../config/db';

export async function getProfile(req: AuthRequest, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized.' });
    }
    const user = await db.findUserById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }
    return res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
    });
  } catch (error: any) {
    return res.status(500).json({ error: 'Failed to fetch user profile.' });
  }
}

export async function updateProfile(req: AuthRequest, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized.' });
    }
    const { name } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Name cannot be empty.' });
    }

    const updated = await db.updateUser(req.user.userId, { name: name.trim() });
    if (!updated) {
      return res.status(404).json({ error: 'User not found.' });
    }

    return res.json({
      message: 'Profile updated successfully',
      user: {
        id: updated._id,
        name: updated.name,
        email: updated.email,
        createdAt: updated.createdAt,
      },
    });
  } catch (error: any) {
    return res.status(500).json({ error: 'Failed to update profile.' });
  }
}

export async function changePassword(req: AuthRequest, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized.' });
    }
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current password and new password are required.' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'New password must be at least 6 characters long.' });
    }

    const user = await db.findUserById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ error: 'Incorrect current password.' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(newPassword, salt);
    await db.updateUser(user._id, { passwordHash });

    return res.json({ message: 'Password changed successfully.' });
  } catch (error: any) {
    return res.status(500).json({ error: 'Failed to update password.' });
  }
}
