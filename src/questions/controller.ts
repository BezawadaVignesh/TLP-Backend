import { Response, Request } from "express";
import dbQuery from "../services/db";
import { responses } from "../services/common";
import { UsersTableArr, subjectTableProps } from "../interfaces/manage";
interface ReportData {
  facID: number;
  facName: string;
  sec: string;
  totalScore: number;
}


// Below are the common functionalites for managing studentInfo, Print and Paid entries

// ANCHOR Getting Student Details 

export async function getQuestions(req: Request, res: Response) {
  try {
    const question = (await dbQuery(
      "SELECT * FROM questions"
    )) as UsersTableArr;
    return res.json({ questions: question });
  } catch (err) {
    console.log(err);
    return res.json(responses.ErrorWhileDBRequest);
  }
}


export async function getSubjects(req: Request, res: Response) {
  try {
    const { username } = req.query;
    if (!username) {
      return res.status(400).json({ error: "Username is required" });
    }
    const subjects =
      `SELECT sem, sec, branch, token FROM studentinfo WHERE rollno = TRIM('${username}')`

    const subsresults: any = await dbQuery(subjects);

    if (subsresults.length === 0) {
      return res.status(404).json({ error: "User not found or no data available" });
    }

    const { sem, sec, branch } = subsresults[0];
    const query = 
      `SELECT t1.subcode, subname, t1.facID, qtype, f.facName
       FROM (SELECT * FROM timetable WHERE sem = TRIM(?) AND sec = TRIM(?) AND branch = TRIM(?)) AS t1
       INNER JOIN subjects ON TRIM(t1.subcode) = TRIM(subjects.subcode)
       INNER JOIN faculty f ON TRIM(f.facID) = TRIM(t1.facID);`
       const subs = await dbQuery(query,  [sem, sec, branch]) as subjectTableProps;
      return res.json({ sub: subs });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}



export async function unfilledstudents(req: Request, res: Response) {
  try {
    const unfilledstudents = await dbQuery(`SELECT rollno, name, sec, sem FROM STUDENTINFO WHERE TOKEN = 'UNDONE';`);
    return res.json({ done: true, unfilledstudents: unfilledstudents });

  } catch (err) {
    console.error("Error updating token:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}




async function Lstn70() {
  try {
    for (let i = 1; i < 11; i++) {
      const theoryquery = `
        INSERT IGNORE INTO lstn70 (facID, subcode, sec, seq, avg)
        SELECT ts.facID, ts.subcode, r.sec, 'q${i}', AVG(q${i})
        FROM theoryscore1 ts
        JOIN report1 r ON ts.facID = r.facID and ts.subcode = r.subcode
        WHERE r.percentile <= 70
        GROUP BY r.sec, ts.subcode;
      `;

      // Execute the query
      const theoryresult: any = await dbQuery(theoryquery);
      if (theoryresult.length === 0) {
        return;
      }
    }
    for (let i = 1; i < 9; i++) {
      const labquery = `
      INSERT IGNORE INTO lstn70 (facID, subcode, sec, seq, avg)
      SELECT ls.facID, ls.subcode, r.sec, 'q${i}', AVG(q${i})
      FROM labscore1 ls
      JOIN report1 r ON ls.facID = r.facID and ls.subcode = r.subcode
      WHERE r.percentile <= 70
      GROUP BY r.sec, ls.subcode;
    `;

      // Execute the query
      const labresult: any = await dbQuery(labquery);
      if (labresult.length === 0) {
        return;
      }

    }
  } catch (e) {
    console.log(e);
  }
}





export async function getDetails(req: Request, res: Response) {
  try {
    const { batch, sem } = req.query
    const sec = await dbQuery(`SELECT sec FROM studentinfo where batch=${batch} and sem=${sem} GROUP BY sec`);
    res.json({ sec: sec });
  } catch (error) {
    console.error('Error executing query:', error);
    res.status(500).send('Error executing query');
  }
}



