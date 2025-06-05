import { decode } from 'iconv-lite'
import { RegExes } from './constants'
import type HTTP from './http'

interface Data {
  mainRoute: string
  searchRoute: string
  timetableRoute: string

  teacherCode: string
  originalCode: string
  dayCode: string
  subjectCode: string
  nextWeek: boolean
}

export default class DataManager {
  private _data: Data | null = null

  private _lastFetchDate = 0

  constructor(private readonly http: HTTP) {}

  private async fetchData(): Promise<Data> {
    const res = await this.http.get('/st').then((res) => res.body.arrayBuffer())
    const data = decode(Buffer.from(res), 'euc-kr')

    const main = RegExes.MainRoute.exec(data)
    if (!main) throw new Error('Failed to fetch main route')

    const search = RegExes.SearchRoute.exec(data)
    if (!search) throw new Error('Failed to fetch search route')

    const timetable = RegExes.TimetableRoute.exec(data)
    if (!timetable) throw new Error('Failed to fetch timetable route')

    const teacher = RegExes.TeacherCode.exec(data)
    if (!teacher) throw new Error('Failed to fetch teacher code')

    const original = RegExes.OriginalCode.exec(data)
    if (!original) throw new Error('Failed to fetch original code')

    const day = RegExes.DayCode.exec(data)
    if (!day) throw new Error('Failed to fetch day code')

    const subject = RegExes.SubjectCode.exec(data)
    if (!subject) throw new Error('Failed to fetch subject code')

    this._lastFetchDate = new Date().getDate()
    this._data = {
      mainRoute: main[0],
      searchRoute: search[0],
      timetableRoute: timetable[0],
      teacherCode: teacher[0],
      originalCode: original[0],
      dayCode: day[0],
      subjectCode: subject[0],
      nextWeek: false,
    }
    return this._data
  }

  async getData() {
    if (this._data && this._lastFetchDate === new Date().getDate())
      return this._data

    return this.fetchData()
  }
}
