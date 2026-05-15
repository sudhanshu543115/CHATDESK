import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { ArrowLeft, Plus, Calendar, User, Briefcase, Mail, Download, Trash2, CheckCircle2, AlertCircle, Clock } from 'lucide-react';
import { useSelector } from 'react-redux';
import Input from '@components/common/Input';

const ReportForm = () => {
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);

  const [formData, setFormData] = useState({
    reportDate: new Date().toISOString().split('T')[0],
    reporterName: user?.username || '',
    designation: 'Web Developer',
    projects: [''],
    distribution: [{ name: '', email: '' }],
    tasksCompleted: [''],
    ongoingTasks: [''],
    teamSummary: [{ name: '', summary: '' }],
    issues: { text: '', include: true },
    tomorrowsPlan: { text: '', include: true },
    closingRemarks: ''
  });

  const handleArrayChange = (field, index, key, value) => {
    const newArray = [...formData[field]];
    if (key === null) {
      newArray[index] = value;
    } else {
      newArray[index][key] = value;
    }
    setFormData({ ...formData, [field]: newArray });
  };

  const addArrayItem = (field, emptyItem) => {
    setFormData({ ...formData, [field]: [...formData[field], emptyItem] });
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    
    // Header
    doc.setFontSize(24);
    doc.setTextColor(37, 99, 235); // Blue
    doc.text('BITMAX', 14, 20);
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text('TECHNOLOGIES PVT LTD', 14, 25);
    
    doc.setFontSize(20);
    doc.setTextColor(37, 99, 235);
    doc.text('Daily Work Report', pageWidth - 14, 20, { align: 'right' });
    doc.setFontSize(10);
    doc.setTextColor(150);
    doc.text('Professional Progress Tracking & Documentation', pageWidth - 14, 25, { align: 'right' });
    
    // Info Box
    doc.setDrawColor(200);
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(14, 35, pageWidth - 28, 30, 3, 3, 'FD');
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text('Date', 20, 45);
    doc.text('Designation', 20, 55);
    doc.text('Reported By', pageWidth / 2, 45);
    doc.text('Department', pageWidth / 2, 55);
    
    doc.setTextColor(30);
    doc.text(formData.reportDate, 20, 50);
    doc.text(formData.designation, 20, 60);
    doc.text(formData.reporterName, pageWidth / 2, 50);
    doc.text('IT', pageWidth / 2, 60);

    let currentY = 75;

    // Helper for sections
    const addSection = (title, contentFunc) => {
      if (currentY > 270) { doc.addPage(); currentY = 20; }
      doc.setFontSize(12);
      doc.setTextColor(37, 99, 235);
      doc.text(title, 14, currentY);
      doc.setDrawColor(226, 232, 240);
      doc.line(14, currentY + 2, pageWidth - 14, currentY + 2);
      currentY += 10;
      contentFunc();
      currentY += 10;
    };

    // Projects
    if (formData.projects.some(p => p)) {
      addSection('Projects', () => {
        doc.setFillColor(248, 250, 252);
        doc.roundedRect(14, currentY, pageWidth - 28, formData.projects.length * 10 + 4, 2, 2, 'F');
        doc.setFontSize(10);
        doc.setTextColor(50);
        formData.projects.forEach((p, i) => {
          if (p) doc.text(`• ${p}`, 20, currentY + 8 + (i * 10));
        });
        currentY += formData.projects.length * 10 + 4;
      });
    }

    // Distribution
    if (formData.distribution.some(d => d.name)) {
      addSection('Report Distribution', () => {
        doc.setFillColor(248, 250, 252);
        doc.roundedRect(14, currentY, pageWidth - 28, formData.distribution.length * 10 + 4, 2, 2, 'F');
        doc.setFontSize(10);
        doc.setTextColor(50);
        formData.distribution.forEach((d, i) => {
          if (d.name) doc.text(`• ${d.name} ${d.email ? `- ${d.email}` : ''}`, 20, currentY + 8 + (i * 10));
        });
        currentY += formData.distribution.length * 10 + 4;
      });
    }

    // Tasks Completed
    if (formData.tasksCompleted.some(t => t)) {
      addSection('Tasks Completed', () => {
        doc.setFillColor(248, 250, 252);
        doc.roundedRect(14, currentY, pageWidth - 28, formData.tasksCompleted.length * 10 + 4, 2, 2, 'F');
        doc.setFontSize(10);
        doc.setTextColor(50);
        formData.tasksCompleted.forEach((t, i) => {
          if (t) doc.text(`• ${t}`, 20, currentY + 8 + (i * 10));
        });
        currentY += formData.tasksCompleted.length * 10 + 4;
      });
    }

    // Ongoing
    if (formData.ongoingTasks.some(t => t)) {
      addSection('Ongoing / In Progress', () => {
        doc.setFillColor(248, 250, 252);
        doc.roundedRect(14, currentY, pageWidth - 28, formData.ongoingTasks.length * 10 + 4, 2, 2, 'F');
        doc.setFontSize(10);
        doc.setTextColor(50);
        formData.ongoingTasks.forEach((t, i) => {
          if (t) doc.text(`• ${t}`, 20, currentY + 8 + (i * 10));
        });
        currentY += formData.ongoingTasks.length * 10 + 4;
      });
    }

    // Tomorrow's Plan
    if (formData.tomorrowsPlan.include && formData.tomorrowsPlan.text) {
      addSection('Plan for Tomorrow', () => {
        doc.setFillColor(248, 250, 252);
        doc.roundedRect(14, currentY, pageWidth - 28, 14, 2, 2, 'F');
        doc.setFontSize(10);
        doc.setTextColor(50);
        doc.text(`• ${formData.tomorrowsPlan.text}`, 20, currentY + 8);
        currentY += 14;
      });
    }

    // Footer
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text(`Page 1 of 1`, pageWidth / 2, doc.internal.pageSize.height - 10, { align: 'center' });

    doc.save(`Daily_Work_Report_${formData.reportDate}.pdf`);
  };

  return (
    <div className="flex-1 h-screen overflow-y-auto bg-slate-50 dark:bg-[#0B1121] p-8 text-slate-800 dark:text-slate-200">
      <div className="max-w-4xl mx-auto">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm font-bold text-primary-500 mb-6 bg-primary-500/10 px-4 py-2 rounded-lg border border-primary-500/20 hover:bg-primary-500/20 transition-all">
          <ArrowLeft className="w-4 h-4" /> BACK TO REPORTS
        </button>

        <div className="bg-white dark:bg-[#111827] rounded-xl border border-slate-200 dark:border-slate-800 p-8 shadow-xl">
          <div className="flex justify-between items-start mb-8 pb-8 border-b border-slate-200 dark:border-slate-800">
            <div>
              <p className="text-primary-500 font-bold text-xs tracking-wider uppercase mb-1">Internal Document</p>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Daily Work Report</h1>
            </div>
            <div className="bg-slate-50 dark:bg-[#1F2937] px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-sm font-medium flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span>Submission Date: <br/><strong className="text-slate-900 dark:text-white">{new Date().toISOString().split('T')[0]}</strong></span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6 mb-8">
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wide">Report Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input type="date" value={formData.reportDate} onChange={e => setFormData({...formData, reportDate: e.target.value})} className="w-full bg-slate-50 dark:bg-[#1F2937] border border-slate-200 dark:border-slate-700 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 outline-none" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wide">Reporter Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input type="text" value={formData.reporterName} onChange={e => setFormData({...formData, reporterName: e.target.value})} className="w-full bg-slate-50 dark:bg-[#1F2937] border border-slate-200 dark:border-slate-700 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 outline-none" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wide">Designation</label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input type="text" value={formData.designation} onChange={e => setFormData({...formData, designation: e.target.value})} className="w-full bg-slate-50 dark:bg-[#1F2937] border border-slate-200 dark:border-slate-700 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 outline-none" />
              </div>
            </div>
          </div>

          <div className="space-y-8">
            {/* Active Projects */}
            <div className="bg-slate-50 dark:bg-[#161f33] p-5 rounded-xl border border-slate-200 dark:border-slate-800">
              <h3 className="flex items-center gap-2 text-sm font-bold mb-4 text-slate-800 dark:text-slate-200"><Briefcase className="w-4 h-4 text-primary-500" /> ACTIVE PROJECTS</h3>
              {formData.projects.map((p, i) => (
                <input key={i} type="text" placeholder="Search or enter project name..." value={p} onChange={e => handleArrayChange('projects', i, null, e.target.value)} className="w-full bg-white dark:bg-[#1F2937] border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 outline-none mb-3" />
              ))}
              <button onClick={() => addArrayItem('projects', '')} className="flex items-center gap-2 text-xs font-bold text-primary-500 mt-2 px-3 py-1.5 rounded-lg border border-primary-500/30 hover:bg-primary-500/10">
                <Plus className="w-3 h-3" /> ADD PROJECT
              </button>
            </div>

            {/* Task Completed */}
            <div className="border-t border-slate-200 dark:border-slate-800 pt-8">
              <h3 className="flex items-center gap-2 text-sm font-bold mb-4 text-slate-800 dark:text-slate-200"><CheckCircle2 className="w-4 h-4 text-primary-500" /> TASKS COMPLETED</h3>
              {formData.tasksCompleted.map((t, i) => (
                <input key={i} type="text" placeholder="Describe what was achieved..." value={t} onChange={e => handleArrayChange('tasksCompleted', i, null, e.target.value)} className="w-full bg-slate-50 dark:bg-[#1F2937] border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 outline-none mb-3" />
              ))}
              <button onClick={() => addArrayItem('tasksCompleted', '')} className="flex items-center gap-2 text-xs font-bold text-primary-500 mt-2 bg-primary-500/10 px-3 py-1.5 rounded-lg hover:bg-primary-500/20">
                <Plus className="w-3 h-3" /> NEW TASK
              </button>
            </div>

            {/* Plan for Tomorrow */}
            <div className="grid grid-cols-2 gap-6 pt-8 border-t border-slate-200 dark:border-slate-800">
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="flex items-center gap-2 text-sm font-bold text-slate-800 dark:text-slate-200"><AlertCircle className="w-4 h-4 text-red-500" /> ISSUES / BLOCKERS</h3>
                  <label className="flex items-center gap-2 text-xs font-medium"><input type="checkbox" checked={formData.issues.include} onChange={e => setFormData({...formData, issues: {...formData.issues, include: e.target.checked}})} className="rounded text-primary-500 focus:ring-primary-500" /> Include</label>
                </div>
                {formData.issues.include && (
                  <input type="text" placeholder="Describe an issue or blocker..." value={formData.issues.text} onChange={e => setFormData({...formData, issues: {...formData.issues, text: e.target.value}})} className="w-full bg-slate-50 dark:bg-[#1F2937] border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-red-500 outline-none" />
                )}
              </div>
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="flex items-center gap-2 text-sm font-bold text-slate-800 dark:text-slate-200"><Clock className="w-4 h-4 text-primary-500" /> TOMORROW'S PLAN</h3>
                  <label className="flex items-center gap-2 text-xs font-medium"><input type="checkbox" checked={formData.tomorrowsPlan.include} onChange={e => setFormData({...formData, tomorrowsPlan: {...formData.tomorrowsPlan, include: e.target.checked}})} className="rounded text-primary-500 focus:ring-primary-500" /> Include</label>
                </div>
                {formData.tomorrowsPlan.include && (
                  <input type="text" placeholder="Plan for tomorrow..." value={formData.tomorrowsPlan.text} onChange={e => setFormData({...formData, tomorrowsPlan: {...formData.tomorrowsPlan, text: e.target.value}})} className="w-full bg-slate-50 dark:bg-[#1F2937] border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 outline-none" />
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center mt-12 pt-8 border-t border-slate-200 dark:border-slate-800">
            <button className="text-xs font-bold text-slate-500 flex items-center gap-2 hover:text-red-500 transition-colors">
              <Trash2 className="w-4 h-4" /> CLEAR DRAFT
            </button>
            <div className="flex items-center gap-4">
              <button className="text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white px-4 py-2">CANCEL</button>
              <button onClick={generatePDF} className="bg-primary-500 hover:bg-primary-600 text-white font-bold text-sm px-6 py-2.5 rounded-lg flex items-center gap-2 transition-colors shadow-lg shadow-primary-500/30">
                <Download className="w-4 h-4" /> GENERATE REPORT
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportForm;
