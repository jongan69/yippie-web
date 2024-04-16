import { NextResponse } from "next/server";
import fs from 'fs';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'data.json');
export async function POST(req: Request, res: Response) {
    try {
        const data = await req.json();
        console.log('Received data:', data);
        console.log('Saving data:', dataFilePath);
        // Read existing data from file
        let existingData = [];
        try {
            existingData = JSON.parse(fs.readFileSync(dataFilePath, 'utf8'));
        } catch (error) {
            console.error('Error reading data file:', error);
            return NextResponse.json({ message: `Error: ${error}` });

        }
        // Add new data
        existingData.push(data);
        // Write updated data to file
        try {
            fs.writeFileSync(dataFilePath, JSON.stringify(existingData, null, 2));
            return NextResponse.json({ message: 'Data received and saved successfully!' });
        } catch (error) {
            console.error('Error writing data file:', error);
            return NextResponse.json({ message: 'Error saving data' });
        }
    } catch (error) {
        return NextResponse.json({ message: `Error: ${error}` });
    }
}