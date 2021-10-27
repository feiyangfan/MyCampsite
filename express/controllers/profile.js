import Profile from "../models/Profile.js"

export const getProfile = async (req, res) => {
    const id = req.params.id;
    const uid = req.auth?.uid;

    if (!id && !uid)
        res.sendStatus(401)
    else if (id && id !== uid)
        res.json(await Profile.findById(id))
    else
        res.json(await Profile.findOne({uid: uid}))
};

export const setProfile = async (req, res) => {
};
